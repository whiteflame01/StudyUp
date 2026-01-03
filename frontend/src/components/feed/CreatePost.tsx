import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { postsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

import type { Post } from '@/types/api';

interface CreatePostProps {
  onPostCreated?: (post: Post) => void;
  forumId?: string;
}

export function CreatePost({ onPostCreated, forumId }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      const scrollHeight = contentRef.current.scrollHeight;
      const lineHeight = 20; // approximate line height in pixels
      const maxHeight = lineHeight * 4; // 4 lines max
      contentRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [content]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await postsApi.createPost({
        title: title.trim(),
        content: content.trim(),
        forumId,
      });

      // Clear the form
      setTitle('');
      setContent('');
      
      toast({
        title: 'Success',
        description: 'Your post has been created!',
      });

      // Call the callback with the newly created post
      if (onPostCreated && response.data.post) {
        onPostCreated(response.data.post);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 bg-white border-b border-gray-100">
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 mt-1">
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-xs">
            {user.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <input
            ref={titleRef}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full resize-none border-0 focus:outline-none focus:ring-0 text-sm font-semibold placeholder:text-gray-400 placeholder:font-normal mb-1"
          />
          <textarea
            ref={contentRef}
            placeholder="What are you studying?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={1}
            maxLength={500}
            className="w-full resize-none border-0 focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400 transition-all overflow-y-auto"
            style={{ minHeight: '20px' }}
          />
          
        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">
            {content.length}/500
            </span>
            <Button 
            size="sm" 
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
            className="h-7 px-4 text-xs rounded-full"
            >
            {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
