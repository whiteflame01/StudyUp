import { Server } from 'socket.io';

interface OnlineUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
}

class SocketService {
  private io: Server | null = null;
  private onlineUsers: Map<string, OnlineUser> = new Map();

  initialize(io: Server) {
    this.io = io;
    console.log('✅ Socket service initialized');
  }

  getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.IO not initialized');
    }
    return this.io;
  }

  // Track online users
  addOnlineUser(userId: string, socketId: string) {
    this.onlineUsers.set(userId, {
      userId,
      socketId,
      connectedAt: new Date()
    });
    console.log(`📊 Online users: ${this.onlineUsers.size}`);
  }

  removeOnlineUser(userId: string) {
    this.onlineUsers.delete(userId);
    console.log(`📊 Online users: ${this.onlineUsers.size}`);
  }

  getOnlineUser(userId: string): OnlineUser | undefined {
    return this.onlineUsers.get(userId);
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  getAllOnlineUsers(): string[] {
    return Array.from(this.onlineUsers.keys());
  }

  // Emit to specific user
  emitToUser(userId: string, event: string, data: any) {
    if (!this.io) return;
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Emit to chat room
  emitToChat(chatId: string, event: string, data: any) {
    if (!this.io) return;
    this.io.to(`chat:${chatId}`).emit(event, data);
  }

  // Emit to all except sender
  emitToChatExcept(chatId: string, senderId: string, event: string, data: any) {
    if (!this.io) return;
    const user = this.getOnlineUser(senderId);
    if (user) {
      this.io.to(`chat:${chatId}`).except(user.socketId).emit(event, data);
    }
  }

  // Broadcast to all connected clients
  broadcast(event: string, data: any) {
    if (!this.io) return;
    this.io.emit(event, data);
  }
}

// Export singleton instance
export const socketService = new SocketService();
