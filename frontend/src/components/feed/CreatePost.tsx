import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export function CreatePost() {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 20; // approximate line height in pixels
      const maxHeight = lineHeight * 4; // 4 lines max
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [content]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    // TODO: Implement post creation API call
    console.log('Creating post:', content);
    
    // Clear the textarea
    setContent('');
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
          <textarea
            ref={textareaRef}
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
            disabled={!content.trim()}
            className="h-7 px-4 text-xs rounded-full"
            >
            Post
            </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
