import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart,
  MoreHorizontal
} from 'lucide-react';
import type { Post } from '@/types/api';
import { useState, useEffect } from 'react';
import { postsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [, setCommentsCount] = useState(post._count?.comments || 0);
  const [showComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const authorInitials = post.author.username.substring(0, 2).toUpperCase();

  // Sync liked state when post.isLiked changes (e.g., on refetch)
  useEffect(() => {
    setLiked(post.isLiked || false);
  }, [post.isLiked]);

  // Sync counts when post data changes
  useEffect(() => {
    setLikesCount(post._count?.likes || 0);
    setCommentsCount(post._count?.comments || 0);
  }, [post._count?.likes, post._count?.comments]);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (liked) {
        const response = await postsApi.unlikePost(post.id);
        setLiked(false);
        setLikesCount(response.data.likeCount);
      } else {
        const response = await postsApi.likePost(post.id);
        setLiked(true);
        setLikesCount(response.data.likeCount);
      }
    } catch (error: any) {
      console.error('Error liking/unliking post:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update like status',
        variant: 'destructive',
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await postsApi.addComment(post.id, { content: commentText });
      setCommentText('');
      setCommentsCount(prev => prev + 1);
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 h-8 px-2 transition-colors ${
            liked 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-gray-600 hover:text-red-600'
          }`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          <span className="text-xs">{likesCount}</span>
        </Button>
        {/* <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 h-8 px-2 text-gray-600 hover:text-blue-600"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">{commentsCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-gray-600 hover:text-blue-600">
          <Send className="h-4 w-4" />
        </Button> */}
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
              disabled={isSubmittingComment}
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!commentText.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? 'Posting...' : 'Post'}
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
