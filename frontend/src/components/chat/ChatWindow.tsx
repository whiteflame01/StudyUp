import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image,
  Send,
  Smile,
  Check,
  CheckCheck,
} from 'lucide-react';
import { mockUsers, mockMessages, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { Message } from '@/types';

interface ChatWindowProps {
  userId: string;
}

export function ChatWindow({ userId }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = mockUsers.find(u => u.id === userId) || mockUsers[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: userId,
      content: message,
      sentAt: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatDateDivider = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const shouldShowDateDivider = (msg: Message, idx: number) => {
    if (idx === 0) return true;
    return !isSameDay(msg.sentAt, messages[idx - 1].sentAt);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{user.name}</h3>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="iconSm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="iconSm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="iconSm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg, idx) => {
          const isCurrentUser = msg.senderId === currentUser.id;
          const showDivider = shouldShowDateDivider(msg, idx);

          return (
            <div key={msg.id}>
              {showDivider && (
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDateDivider(msg.sentAt)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}

              <div className={cn(
                'flex gap-2',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  'max-w-[70%] rounded-2xl px-4 py-2.5',
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className={cn(
                    'flex items-center justify-end gap-1 mt-1',
                    isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    <span className="text-[10px]">
                      {format(msg.sentAt, 'HH:mm')}
                    </span>
                    {isCurrentUser && (
                      msg.readAt ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
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

      {/* Input */}
      <div className="border-t p-4 bg-card">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="iconSm" className="text-muted-foreground">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="iconSm" className="text-muted-foreground">
              <Image className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button 
              variant="ghost" 
              size="iconSm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!message.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}