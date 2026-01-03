import { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Send, 
  Check, 
  CheckCheck,
  Loader2
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { chatsApi, usersApi } from '@/lib/api';
import { ChatMessage } from '@/types/api';

interface ChatWindowProps {
  userId: string;
  onBack?: () => void;
}

export function ChatWindow({ userId, onBack }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user: currentAuthUser } = useAuth();
  const { socket, connected, joinChat, leaveChat, startTyping, stopTyping, on, off, isUserOnline } = useSocket();
  const queryClient = useQueryClient();

  // Fetch or create chat with this user
  const { data: chatData, isLoading: isChatLoading } = useQuery({
    queryKey: ['chat', userId],
    queryFn: () => chatsApi.getChatWithUser(userId),
    enabled: !!userId && !!currentAuthUser,
  });

  // Fetch user details
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  });

  // Load messages when chat is ready
  useEffect(() => {
    if (chatData?.data.chat) {
      setChatId(chatData.data.chatId);
      setMessages(chatData.data.chat.messages || []);
    }
  }, [chatData]);

  const user = userData?.data.user;
  const isLoading = isChatLoading || isUserLoading;

  // Check if the other user is online
  const userOnline = isUserOnline(userId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket: Join and leave chat room
  useEffect(() => {
    if (!socket || !connected || !chatId) return;

    console.log(`🔗 Joining chat room: ${chatId}`);
    joinChat(chatId);

    return () => {
      console.log(`🔌 Leaving chat room: ${chatId}`);
      leaveChat(chatId);
    };
  }, [socket, connected, chatId, joinChat, leaveChat]);

  // WebSocket: Listen for incoming messages
  useEffect(() => {
    if (!socket || !connected) return;

    const handleNewMessage = (newMessage: ChatMessage) => {
      console.log('📨 New message received:', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      
      // Invalidate chats query to update sidebar
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    const handleTypingStart = ({ userId: typingUserId }: { userId: string; chatId: string }) => {
      if (typingUserId === userId) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = ({ userId: typingUserId }: { userId: string; chatId: string }) => {
      if (typingUserId === userId) {
        setIsTyping(false);
      }
    };

    on('message:new', handleNewMessage);
    on('typing:start', handleTypingStart);
    on('typing:stop', handleTypingStop);

    return () => {
      off('message:new', handleNewMessage);
      off('typing:start', handleTypingStart);
      off('typing:stop', handleTypingStop);
    };
  }, [socket, connected, userId, on, off]);

  const handleSend = () => {
    if (!message.trim() || !socket || !connected || !currentAuthUser || !chatId) return;

    // Emit message through WebSocket
    socket.emit('message:send', {
      chatId,
      content: message.trim(),
      receiverId: userId,
    });

    setMessage('');
    
    // Stop typing indicator
    if (currentAuthUser.id) {
      stopTyping(chatId, currentAuthUser.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle typing indicator
  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (!currentAuthUser?.id || !socket || !connected) return;

    // Start typing
    if (value.trim() && !typingTimeoutRef.current) {
      startTyping(chatId, currentAuthUser.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (currentAuthUser.id) {
        stopTyping(chatId, currentAuthUser.id);
      }
      typingTimeoutRef.current = null;
    }, 2000);
  };

  // Helper: Determine if we should show a "Today" or "Date" divider
  const shouldShowDateDivider = (msg: ChatMessage, idx: number) => {
    if (idx === 0) return true;
    const prevMsg = messages[idx - 1];
    return !isSameDay(new Date(msg.createdAt), new Date(prevMsg.createdAt));
  };

  // Helper: Format the divider text
  const formatDateDivider = (date: Date) => {
    if (isSameDay(new Date(date), new Date())) return 'Today';
    return format(new Date(date), 'MMMM d, yyyy');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {!isLoading && user && (
        <>
      {/* Header */}
      <div className="p-2 sm:p-3 border-b flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 md:hidden"
              onClick={onBack}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          )}
          {user.profile?.avatarUrl ? (
            <img 
              src={user.profile.avatarUrl} 
              alt={user.username}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-xs sm:text-sm">@{user.username}</p>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                userOnline ? "bg-green-500" : "bg-gray-400"
              )} />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {isTyping ? 'typing...' : (userOnline ? 'Online' : 'Offline')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
        {messages.map((msg, idx) => {
          const isCurrentUser = msg.senderId === currentAuthUser?.id;
          const showDivider = shouldShowDateDivider(msg, idx);

          return (
            <div key={msg.id}>
              {showDivider && (
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {formatDateDivider(new Date(msg.createdAt))}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}

              <div className={cn(
                'flex gap-3',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 shrink-0 mt-auto">
                    <AvatarFallback className="text-[10px]">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none'
                )}>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <div className={cn(
                    'flex items-center justify-end gap-1 mt-1 opacity-70',
                    isCurrentUser ? 'text-primary-foreground' : 'text-muted-foreground'
                  )}>
                    <span className="text-[9px] sm:text-[10px]">
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </span>
                    {isCurrentUser && (
                      msg.readAt ? (
                        <CheckCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      ) : (
                        <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-2 sm:p-3 bg-card">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!connected}
            className="flex-1 px-3 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button 
            onClick={handleSend}
            disabled={!message.trim() || !connected || !chatId}
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}