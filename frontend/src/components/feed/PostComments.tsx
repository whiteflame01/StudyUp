import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { postsApi } from '@/lib/api';
import type { Comment } from '@/types/api';

interface PostCommentsProps {
  postId: string;
  isOpen: boolean;
  onCommentAdded?: () => void;
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

export function PostComments({ postId, isOpen, onCommentAdded }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments when component opens
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await postsApi.getComments(postId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await postsApi.addComment(postId, newComment.trim());
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
      // Notify parent component about new comment
      onCommentAdded?.();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-4">
          <div className="flex gap-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
              className="self-end"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No comments yet.</p>
              <p className="text-xs mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const authorInitials = comment.author.username.substring(0, 2).toUpperCase();
              
              return (
                <div key={comment.id} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold text-xs">
                      {authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.author.username}</span>
                      {comment.author.profile?.major && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {comment.author.profile.major}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}