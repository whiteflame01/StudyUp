import { mockUsers } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function ChatSidebar({ selectedUserId, onSelectUser }: ChatSidebarProps) {
  const users = mockUsers.slice(0, 5);

  return (
    <div className="w-full md:w-64 border-r flex flex-col h-full">
      <div className="p-3 border-b">
        <h2 className="font-medium text-base">Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={cn(
              'w-full p-3 text-left hover:bg-gray-50 transition-colors border-b',
              selectedUserId === user.id && 'bg-gray-100'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">Online</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}