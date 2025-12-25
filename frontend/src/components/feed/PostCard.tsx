import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart,
  MessageSquare,
  Send,
  MoreHorizontal
} from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  similarity: number;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="p-4 hover:bg-gray-50 transition-colors">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold text-sm">
              {post.userId.split('_')[1].slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{post.userId}</span>
              <span className="text-xs text-green-600 font-semibold">
                {post.similarity}% match
              </span>
            </div>
            <span className="text-xs text-gray-500">{post.timestamp}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <p className="text-sm text-gray-900 mb-3 leading-relaxed">
        {post.content}
      </p>

      {/* Post Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-gray-600 hover:text-red-600">
          <Heart className="h-4 w-4" />
          <span className="text-xs">{post.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-gray-600 hover:text-blue-600">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">{post.comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-gray-600 hover:text-blue-600">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
