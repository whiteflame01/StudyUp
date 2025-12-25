// WebSocket event types for type safety

export interface SocketMessage {
  chatId: string;
  message: {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    sentAt: Date;
  };
}

export interface TypingEvent {
  chatId: string;
  userId: string;
}

export interface OnlineStatusEvent {
  userId: string;
  status: 'online' | 'offline';
}

// Client -> Server events
export interface ClientToServerEvents {
  authenticate: (userId: string) => void;
  'chat:join': (chatId: string) => void;
  'chat:leave': (chatId: string) => void;
  'message:send': (data: SocketMessage) => void;
  'typing:start': (data: TypingEvent) => void;
  'typing:stop': (data: TypingEvent) => void;
}

// Server -> Client events
export interface ServerToClientEvents {
  'message:new': (message: SocketMessage['message']) => void;
  'typing:start': (data: TypingEvent) => void;
  'typing:stop': (data: TypingEvent) => void;
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  'users:online': (userIds: string[]) => void;
}
