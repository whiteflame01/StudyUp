import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Edit } from 'lucide-react';
import { mockUsers, mockMessages } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatSidebarProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

interface Conversation {
  userId: string;
  user: typeof mockUsers[0];
  lastMessage: typeof mockMessages[0];
  unreadCount: number;
}

export function ChatSidebar({ selectedUserId, onSelectUser }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Create conversations from messages
  const conversations: Conversation[] = mockUsers.slice(0, 5).map((user, idx) => ({
    userId: user.id,
    user,
    lastMessage: mockMessages[idx % mockMessages.length],
    unreadCount: idx === 0 ? 2 : idx === 2 ? 1 : 0,
  }));

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <div className="flex h-full flex-col border-r bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button variant="ghost" size="iconSm">
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.map((conv) => (
          <button
            key={conv.userId}
            onClick={() => onSelectUser(conv.userId)}
            className={cn(
              'w-full flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors text-left',
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
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-card-foreground truncate">
                  {conv.user.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {formatMessageTime(conv.lastMessage.sentAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate pr-2">
                  {conv.lastMessage.content}
                </p>
                {conv.unreadCount > 0 && (
                  <Badge className="h-5 min-w-[20px] px-1.5 text-xs bg-primary">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}