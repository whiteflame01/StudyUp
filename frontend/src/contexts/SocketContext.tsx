import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  onlineUsers: [],
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
        setOnlineUsers([]);
      }
      return;
    }

    // Create socket connection
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
    
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected:', newSocket.id);
      setConnected(true);
      
      // Authenticate the socket connection with user ID
      if (user.id) {
        newSocket.emit('authenticate', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnected(false);
    });

    // Listen for online users updates
    newSocket.on('users:online', (users: string[]) => {
      console.log('👥 Online users updated:', users.length);
      setOnlineUsers(users);
    });

    newSocket.on('user:online', (userId: string) => {
      console.log('✨ User came online:', userId);
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    newSocket.on('user:offline', (userId: string) => {
      console.log('💤 User went offline:', userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
      setOnlineUsers([]);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, connected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
