import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { chatsApi } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ChatSidebarProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function ChatSidebar({ selectedUserId, onSelectUser }: ChatSidebarProps) {
  const { onlineUsers } = useSocket();
  
  // Fetch real chats from API
  const { data: chatsData, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsApi.getChats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="w-full md:w-64 border-r flex flex-col h-full">
        <div className="p-3 border-b">
          <h2 className="font-medium text-base">Chats</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const chats = chatsData?.data.chats || [];

  return (
    <div className="w-full md:w-64 border-r flex flex-col h-full">
      <div className="p-3 border-b">
        <h2 className="font-medium text-base">Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No chats yet. Start a conversation from the Explore page!
          </div>
        ) : (
          chats.map((chat) => {
            const isOnline = onlineUsers.includes(chat.otherUser.id);
            const lastMessageTime = chat.lastMessage 
              ? format(new Date(chat.lastMessage.createdAt), 'p')
              : '';

            return (
              <button
                key={chat.id}
                onClick={() => onSelectUser(chat.otherUser.id)}
                className={cn(
                  'w-full p-3 text-left hover:bg-gray-50 transition-colors border-b',
                  selectedUserId === chat.otherUser.id && 'bg-gray-100'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {chat.otherUser.profile?.avatarUrl ? (
                      <img 
                        src={chat.otherUser.profile.avatarUrl} 
                        alt={chat.otherUser.username}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {chat.otherUser.username.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate">
                        {chat.otherUser.username}
                      </p>
                      {lastMessageTime && (
                        <span className="text-xs text-gray-400 ml-2">
                          {lastMessageTime}
                        </span>
                      )}
                    </div>
                    {chat.lastMessage ? (
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}