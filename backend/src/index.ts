import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import prisma from './config/database';
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import usersRoutes from './routes/users';
import chatsRoutes from './routes/chats';

// Load environment variables
dotenv.config();

// Preload word lists into memory (loaded once at server start)
import './utils/words';
import { socketService } from './services/socketService';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Initialize socket service
socketService.initialize(io);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/chats', chatsRoutes);

// API info endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Study Up API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      auth: '/api/v1/auth',
      posts: '/api/v1/posts',
      users: '/api/v1/users',
      chats: '/api/v1/chats'
    },
    message: 'Welcome to Study Up Platform API.'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✨ User connected: ${socket.id}`);

  // Handle user authentication and join
  socket.on('authenticate', (userId: string) => {
    socket.data.userId = userId;
    socket.join(`user:${userId}`);
    socketService.addOnlineUser(userId, socket.id);
    console.log(`👤 User ${userId} authenticated and joined their room`);
    
    // Notify others that user is online
    socket.broadcast.emit('user:online', userId);
    
    // Send list of online users to the newly connected user
    socket.emit('users:online', socketService.getAllOnlineUsers());
  });

  // Handle joining a chat room
  socket.on('chat:join', (chatId: string) => {
    socket.join(`chat:${chatId}`);
    console.log(`💬 User ${socket.data.userId} joined chat ${chatId}`);
  });

  // Handle leaving a chat room
  socket.on('chat:leave', (chatId: string) => {
    socket.leave(`chat:${chatId}`);
    console.log(`👋 User ${socket.data.userId} left chat ${chatId}`);
  });

  // Handle typing indicator
  socket.on('typing:start', ({ chatId, userId }) => {
    socket.to(`chat:${chatId}`).emit('typing:start', { userId, chatId });
  });

  socket.on('typing:stop', ({ chatId, userId }) => {
    socket.to(`chat:${chatId}`).emit('typing:stop', { userId, chatId });
  });

  // Handle sending messages
  socket.on('message:send', async ({ chatId, content, receiverId }) => {
    const senderId = socket.data.userId;
    
    if (!senderId || !content || !chatId) {
      console.error('Invalid message data:', { senderId, content, chatId });
      return;
    }

    try {
      // Save message to database
      const message = await prisma.message.create({
        data: {
          content: content.trim(),
          chatId,
          senderId,
          receiverId,
        },
      });

      // Update chat's updatedAt
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });

      console.log(`💬 Message saved to DB:`, message.id);
      
      // Broadcast the message to everyone in the chat room
      io.to(`chat:${chatId}`).emit('message:new', message);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message:error', { 
        error: 'Failed to send message',
        chatId 
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`👋 User disconnected: ${socket.id}`);
    if (socket.data.userId) {
      socketService.removeOnlineUser(socket.data.userId);
      socket.broadcast.emit('user:offline', socket.data.userId);
    }
  });
});

// Make io instance available to routes
app.set('io', io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API info: http://localhost:${PORT}/`);
});
