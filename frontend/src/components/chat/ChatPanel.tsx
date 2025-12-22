import { ChatWindow } from './ChatWindow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface ChatPanelProps {
  selectedUserId: string | null;
  onBack?: () => void;
}

export function ChatPanel({ selectedUserId, onBack }: ChatPanelProps) {
  if (!selectedUserId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-background">
        <div className="text-center max-w-md">
          <div className="text-muted-foreground mb-4">
            <MessageSquare className="h-24 w-24 mx-auto" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Select a conversation
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Choose a conversation from the list to start messaging
          </p>
          
          {/* Anonymous Messaging Info Card */}
          <Card className="p-4 bg-muted border-border text-left">
            <h4 className="font-semibold text-sm text-foreground mb-2">
              Anonymous Messaging
            </h4>
            <p className="text-xs text-muted-foreground">
              All conversations are anonymous. Users only see your User ID, never your real identity or email.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Mobile back button */}
      {onBack && (
        <div className="flex items-center gap-2 p-3 border-b bg-card">
          <Button variant="ghost" size="iconSm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium">Back to conversations</span>
        </div>
      )}
      
      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow userId={selectedUserId} />
      </div>
    </div>
  );
}
