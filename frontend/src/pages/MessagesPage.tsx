import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  similarity: number;
  online: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    userId: 'User_8492',
    lastMessage: 'Thanks for the help with quantum mechanics!',
    timestamp: '5m ago',
    unread: 2,
    similarity: 98,
    online: true
  },
  {
    id: '2',
    userId: 'User_3721',
    lastMessage: 'Do you want to study together tomorrow?',
    timestamp: '1h ago',
    unread: 0,
    similarity: 96,
    online: true
  },
  {
    id: '3',
    userId: 'User_5634',
    lastMessage: 'I found a great resource for organic chemistry',
    timestamp: '3h ago',
    unread: 1,
    similarity: 94,
    online: false
  },
  {
    id: '4',
    userId: 'User_2193',
    lastMessage: 'Let me know if you need more practice problems',
    timestamp: '1d ago',
    unread: 0,
    similarity: 92,
    online: false
  },
];

export default function MessagesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-lg font-semibold text-foreground">Messages</h2>
        <p className="text-sm text-muted-foreground">Direct messages with matched users</p>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-border">
        {mockMessages.length > 0 ? (
          mockMessages.map((message) => (
            <div
              key={message.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {message.userId.split('_')[1].slice(0, 2)}
                    </span>
                  </div>
                  {message.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{message.userId}</span>
                      <span className="text-xs text-green-400 font-semibold">
                        {message.similarity}% match
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {message.timestamp}
                      </span>
                      {message.unread > 0 && (
                        <Badge variant="destructive" className="h-5 px-2 text-xs">
                          {message.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="text-muted-foreground mb-2">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Start chatting with users from your feed
            </p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="m-4 p-4 bg-muted border-border">
        <h3 className="font-semibold text-sm text-foreground mb-2">Anonymous Messaging</h3>
        <p className="text-xs text-muted-foreground">
          All conversations are anonymous. Users only see your User ID, never your real identity or email.
        </p>
      </Card>
    </div>
  );
}
