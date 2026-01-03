import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  MessageSquare,
  Send,
  MoreHorizontal
} from 'lucide-react';
import type { Post } from '@/types/api';

interface PostCardProps {
  post: Post;
  isNew?: boolean;
}

// Helper function to format timestamp
const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export function PostCard({ post, isNew = false }: PostCardProps) {
  const commentsCount = post._count?.comments || 0;
  const authorInitials = post.author.username.substring(0, 2).toUpperCase();

  return (
    <article 
      className={`p-4 hover:bg-gray-50 transition-all duration-500 ${
        isNew ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold text-sm">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{post.author.username}</span>
              {post.author.profile?.major && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  {post.author.profile.major}
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">{formatTimestamp(post.createdAt)}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Title */}
      {post.title && (
        <h3 className="font-semibold text-base mb-2">{post.title}</h3>
      )}

      {/* Post Content */}
      <p className="text-sm text-gray-900 mb-2 leading-relaxed">
        {post.content}
      </p>

      {/* Post Topic */}
      {post.topic && (
        <Badge variant="outline" className="mb-3">
          {post.topic}
        </Badge>
      )}

      {/* Forum Badge */}
      {post.forum && (
        <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-700">
          # {post.forum.name}
        </Badge>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-gray-600 hover:text-red-600">
          <Heart className="h-4 w-4" />
          <span className="text-xs">0</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-gray-600 hover:text-blue-600">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">{commentsCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-gray-600 hover:text-blue-600">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
