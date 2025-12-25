import { useEffect, useCallback } from 'react';
import { useSocket as useSocketContext } from '@/contexts/SocketContext';

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/**
 * Custom hook to access and manage WebSocket functionality
 */
export function useSocket(options?: UseSocketOptions) {
  const { socket, connected, onlineUsers } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    if (connected && options?.onConnect) {
      options.onConnect();
    }

    const handleDisconnect = () => {
      if (options?.onDisconnect) {
        options.onDisconnect();
      }
    };

    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, connected, options]);

  // Join a chat room
  const joinChat = useCallback((chatId: string) => {
    if (socket && connected) {
      socket.emit('chat:join', chatId);
      console.log(`🔗 Joined chat: ${chatId}`);
    }
  }, [socket, connected]);

  // Leave a chat room
  const leaveChat = useCallback((chatId: string) => {
    if (socket && connected) {
      socket.emit('chat:leave', chatId);
      console.log(`🔌 Left chat: ${chatId}`);
    }
  }, [socket, connected]);

  // Emit typing start indicator
  const startTyping = useCallback((chatId: string, userId: string) => {
    if (socket && connected) {
      socket.emit('typing:start', { chatId, userId });
    }
  }, [socket, connected]);

  // Emit typing stop indicator
  const stopTyping = useCallback((chatId: string, userId: string) => {
    if (socket && connected) {
      socket.emit('typing:stop', { chatId, userId });
    }
  }, [socket, connected]);

  // Subscribe to an event
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  // Unsubscribe from an event
  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  }, [socket]);

  // Emit a custom event
  const emit = useCallback((event: string, ...args: any[]) => {
    if (socket && connected) {
      socket.emit(event, ...args);
    }
  }, [socket, connected]);

  // Check if a user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);

  return {
    socket,
    connected,
    onlineUsers,
    joinChat,
    leaveChat,
    startTyping,
    stopTyping,
    on,
    off,
    emit,
    isUserOnline,
  };
}
