import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StudySession } from '@/types';
import { Clock, Users, Video, Edit, Trash2, MoreHorizontal, Repeat } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SessionCardProps {
  session: StudySession;
  onEdit?: (session: StudySession) => void;
  onDelete?: (sessionId: string) => void;
  onJoin?: (sessionId: string) => void;
  className?: string;
}

export function SessionCard({ session, onEdit, onDelete, onJoin, className }: SessionCardProps) {
  const isPastSession = isPast(session.dateTime);
  
  const getDateLabel = () => {
    if (isToday(session.dateTime)) return 'Today';
    if (isTomorrow(session.dateTime)) return 'Tomorrow';
    return format(session.dateTime, 'EEE, MMM d');
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'scheduled': return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress': return 'bg-success/10 text-success border-success/20';
      case 'completed': return 'bg-muted text-muted-foreground border-muted';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={cn(
      'group transition-all duration-200 hover:shadow-card-hover',
      isPastSession && 'opacity-60',
      className
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Date/Time Block */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-primary/10 px-4 py-3 min-w-[80px]">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {getDateLabel()}
            </span>
            <span className="text-2xl font-bold text-primary">
              {format(session.dateTime, 'HH:mm')}
            </span>
          </div>

          {/* Session Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-card-foreground">{session.title}</h3>
                  {session.isRecurring && (
                    <Repeat className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <Badge variant="secondary" className="mt-1">
                  {session.subject}
                </Badge>
              </div>
              <Badge className={cn('capitalize', getStatusColor())}>
                {session.status}
              </Badge>
            </div>

            {session.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {session.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {session.duration} min
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {session.participants.length} participants
              </span>
            </div>

            {/* Participants */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {session.participantUsers?.slice(0, 4).map((user) => (
                  <Avatar key={user.id} className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs bg-muted">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {session.participants.length > 4 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                    +{session.participants.length - 4}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!isPastSession && session.status === 'scheduled' && (
                  <Button size="sm" variant="gradient" onClick={() => onJoin?.(session.id)}>
                    <Video className="h-4 w-4 mr-1.5" />
                    Join
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="iconSm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(session)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Session
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDelete?.(session.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}