import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Edit, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { User, Message } from '@/types';

interface Conversation {
  userId: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
  lastActivity: Date;
}

interface ConversationPanelProps {
  conversations: Conversation[];
  selectedUserId: string | null;
  searchQuery: string;
  onSelectUser: (userId: string) => void;
  onSearchChange: (query: string) => void;
  onNewMessage?: () => void;
}

export function ConversationPanel({
  conversations,
  selectedUserId,
  searchQuery,
  onSelectUser,
  onSearchChange,
  onNewMessage,
}: ConversationPanelProps) {
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">Messages</h2>
        {onNewMessage && (
          <Button variant="ghost" size="iconSm" onClick={onNewMessage}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {searchQuery ? (
              // No search results
              <div>
                <div className="text-muted-foreground mb-4">
                  <MessageSquare className="h-16 w-16 mx-auto" strokeWidth={1} />
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No conversations found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              // No conversations at all
              <div>
                <div className="text-muted-foreground mb-4">
                  <MessageSquare className="h-16 w-16 mx-auto" strokeWidth={1} />
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No messages yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start a conversation with your study buddies
                </p>
                {onNewMessage && (
                  <Button onClick={onNewMessage} size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.userId}
              onClick={() => onSelectUser(conv.userId)}
              className={cn(
                'w-full flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-none bg-transparent',
                selectedUserId === conv.userId && 'bg-muted'
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {conv.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator - show only if user is online */}
                {conv.user.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-card-foreground truncate">
                    {conv.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {formatMessageTime(conv.lastActivity)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate pr-2">
                    {conv.lastMessage.content}
                  </p>
                  {conv.unreadCount > 0 && (
                    <Badge className="h-5 min-w-[20px] px-1.5 text-xs bg-primary text-primary-foreground">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}