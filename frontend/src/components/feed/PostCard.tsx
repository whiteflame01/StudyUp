import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  MessageSquare
} from 'lucide-react';
import { postsApi } from '@/lib/api';
import { PostComments } from './PostComments';
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
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post._count?.comments || 0);
  
  const authorInitials = post.author.username.substring(0, 2).toUpperCase();

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await postsApi.toggleLike(post.id);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <article 
      className={`p-4 hover:bg-gray-50 transition-all duration-500 ${
        isNew ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
    >
      {/* Post Header */}
      <div className="flex items-center mb-3">
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

      {/* Post Actions */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 h-8 px-2 group transition-all duration-200 ${
            isLiked 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-gray-600 hover:text-red-600'
          }`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-200 ${
              isLiked 
                ? 'fill-red-600' 
                : 'group-hover:fill-red-600'
            }`} 
          />
          <span className="text-xs">{likeCount}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 h-8 px-2 group transition-all duration-200 ${
            showComments 
              ? 'text-blue-600 hover:text-blue-700' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
          onClick={handleToggleComments}
        >
          <MessageSquare 
            className={`h-4 w-4 transition-all duration-200 ${
              showComments 
                ? 'fill-blue-600' 
                : 'group-hover:fill-blue-600'
            }`} 
          />
          <span className="text-xs">{commentsCount}</span>
        </Button>
      </div>

      {/* Comments Section */}
      <PostComments 
        postId={post.id}
        isOpen={showComments}
        onCommentAdded={() => setCommentsCount(prev => prev + 1)}
      />
    </article>
  );
}
