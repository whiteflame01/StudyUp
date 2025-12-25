import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import prisma from '../config/database';
import { socketService } from '../services/socketService';

const router = Router();

/**
 * GET /api/v1/chats
 * Get all chats for the current user
 */
router.get('/', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform to include the other user and last message
    const formattedChats = chats.map((chat) => {
      const otherUser = chat.user1Id === userId ? chat.user2 : chat.user1;
      const lastMessage = chat.messages[0] || null;

      return {
        id: chat.id,
        otherUser,
        lastMessage,
        updatedAt: chat.updatedAt,
      };
    });

    res.json({
      success: true,
      data: {
        chats: formattedChats,
      },
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      error: 'Failed to fetch chats',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/v1/chats/:userId
 * Get or create a chat with a specific user
 */
router.get('/:userId', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { userId } = req.params;

    if (!currentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (currentUserId === userId) {
      res.status(400).json({ error: 'Cannot create chat with yourself' });
      return;
    }

    // Check if other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!otherUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Sort user IDs to ensure consistency
    const [user1Id, user2Id] = [currentUserId, userId].sort();

    // Find or create chat
    let chat = await prisma.chat.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          user1Id,
          user2Id,
        },
        include: {
          messages: true,
        },
      });
    }

    res.json({
      success: true,
      data: {
        chat,
        chatId: chat.id,
      },
    });
  } catch (error) {
    console.error('Error fetching/creating chat:', error);
    res.status(500).json({
      error: 'Failed to fetch chat',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/v1/chats/:chatId/messages
 * Get all messages in a chat
 */
router.get('/:chatId/messages', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { chatId } = req.params;

    if (!currentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify user is part of the chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId },
        ],
      },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found or access denied' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json({
      success: true,
      data: {
        messages,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: 'Failed to fetch messages',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/v1/chats/:chatId/messages
 * Send a message in a chat
 */
router.post('/:chatId/messages', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { chatId } = req.params;
    const { content } = req.body;

    if (!currentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    // Verify user is part of the chat and get the other user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId },
        ],
      },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found or access denied' });
      return;
    }

    const receiverId = chat.user1Id === currentUserId ? chat.user2Id : chat.user1Id;

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        chatId,
        senderId: currentUserId,
        receiverId,
      },
    });

    // Update chat's updatedAt
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Emit message through WebSocket
    try {
      socketService.emitToChat(chatId, 'message:new', message);
    } catch (socketError) {
      console.error('Failed to emit message via socket:', socketError);
    }

    res.status(201).json({
      success: true,
      data: {
        message,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PATCH /api/v1/chats/:chatId/messages/:messageId/read
 * Mark a message as read
 */
router.patch('/:chatId/messages/:messageId/read', authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { chatId, messageId } = req.params;

    if (!currentUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Update message if current user is the receiver
    const message = await prisma.message.updateMany({
      where: {
        id: messageId,
        chatId,
        receiverId: currentUserId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    if (message.count === 0) {
      res.status(404).json({ error: 'Message not found or already read' });
      return;
    }

    res.json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      error: 'Failed to mark message as read',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
