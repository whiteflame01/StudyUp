import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, Clock } from 'lucide-react';

interface ChatRoom {
  id: string;
  name: string;
  type: 'forum' | 'group';
  members: number;
  lastActivity: string;
  unread: number;
}

const mockForums: ChatRoom[] = [
  { id: '1', name: 'Quantum Mechanics Discussion', type: 'forum', members: 234, lastActivity: '2m ago', unread: 5 },
  { id: '2', name: 'Linear Algebra Help', type: 'forum', members: 189, lastActivity: '12m ago', unread: 0 },
  { id: '3', name: 'Organic Chemistry Q&A', type: 'forum', members: 312, lastActivity: '45m ago', unread: 2 },
];

const mockGroups: ChatRoom[] = [
  { id: '4', name: 'Physics Study Group', type: 'group', members: 12, lastActivity: '5m ago', unread: 3 },
  { id: '5', name: 'Calculus II Study Session', type: 'group', members: 8, lastActivity: '1h ago', unread: 0 },
  { id: '6', name: 'Chemistry Lab Prep', type: 'group', members: 15, lastActivity: '2h ago', unread: 1 },
];

export default function ChatsPage() {
  const [activeTab, setActiveTab] = useState<'forum' | 'group'>('forum');

  const rooms = activeTab === 'forum' ? mockForums : mockGroups;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">Chats</h2>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'forum' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('forum')}
            className="gap-2"
          >
            <Hash className="h-4 w-4" />
            Forum
          </Button>
          <Button
            variant={activeTab === 'group' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('group')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Groups
          </Button>
        </div>
      </div>

      {/* Chat Rooms List */}
      <div className="divide-y divide-border">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  {room.type === 'forum' ? (
                    <Hash className="h-6 w-6 text-white" />
                  ) : (
                    <Users className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-foreground truncate">{room.name}</h3>
                    {room.unread > 0 && (
                      <Badge variant="destructive" className="h-5 px-2 text-xs">
                        {room.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
      <Card className="m-4 p-4 bg-muted border-border">
        <h3 className="font-semibold text-sm text-foreground mb-2">
          {activeTab === 'forum' ? 'About Forums' : 'About Groups'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {activeTab === 'forum'
            ? 'Forums are open to everyone. Discuss topics, ask questions, and help others.'
            : 'Groups are smaller study sessions. Join groups focused on specific courses or topics.'}
        </p>
      </Card>
    </div>
  );
}
