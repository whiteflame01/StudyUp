import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, Clock } from 'lucide-react';

interface ChatRoom {
  id: string;
  name: string;
  type: 'forum';
  members: number;
  lastActivity: string;
  unread: number;
}

const mockForums: ChatRoom[] = [
  { id: '1', name: 'Quantum Mechanics Discussion', type: 'forum', members: 234, lastActivity: '2m ago', unread: 5 },
  { id: '2', name: 'Linear Algebra Help', type: 'forum', members: 189, lastActivity: '12m ago', unread: 0 },
  { id: '3', name: 'Organic Chemistry Q&A', type: 'forum', members: 312, lastActivity: '45m ago', unread: 2 },
];

export default function ChatsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h2 className="text-lg font-semibold mb-3">Forums</h2>
      </div>

      {/* Chat Rooms List */}
      <div className="divide-y divide-gray-200">
        {mockForums.map((room) => (
          <div
            key={room.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{room.name}</h3>
                    {room.unread > 0 && (
                      <Badge variant="destructive" className="h-5 px-2 text-xs">
                        {room.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {room.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {room.lastActivity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <Card className="m-4 p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-sm mb-2">About Forums</h3>
        <p className="text-xs text-gray-600">
          Forums are open to everyone. Discuss topics, ask questions, and help others.
        </p>
      </Card>
    </div>
  );
}
