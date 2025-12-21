import React from 'react';
import { StudySession } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Users } from 'lucide-react';

interface UpcomingSessionProps {
  session: StudySession;
  className?: string;
}

export function UpcomingSession({ session, className }: UpcomingSessionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={cn(
      "flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors",
      className
    )}>
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
        <Calendar className="h-5 w-5 text-blue-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground truncate">{session.title}</h4>
        <p className="text-xs text-muted-foreground">{session.subject}</p>
        
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(session.dateTime)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {session.participants.length} participants
          </div>
        </div>
      </div>
    </div>
  );
}