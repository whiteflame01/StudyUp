import { Button } from '@/components/ui/button';
import { CommentComposer } from '@/components/feed/CommentComposer';
import { 
  Heart,
  MessageSquare
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

const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'User_8492',
    content: 'Just finished studying quantum entanglement. The concept of non-locality is mind-blowing. Anyone else working through Chapter 3?',
    timestamp: '2m ago',
    likes: 12,
    comments: 3,
    similarity: 98
  },
  {
    id: '2',
    userId: 'User_3721',
    content: 'Can someone explain why eigenvalues are so important in linear algebra? I get the math but struggling with the intuition.',
    timestamp: '15m ago',
    likes: 8,
    comments: 5,
    similarity: 96
  },
  {
    id: '3',
    userId: 'User_5634',
    content: 'Organic chemistry reactions making sense now after 3 hours. The key is understanding electron flow patterns!',
    timestamp: '1h ago',
    likes: 24,
    comments: 7,
    similarity: 94
  },
  {
    id: '4',
    userId: 'User_2193',
    content: 'Working on calculus optimization problems. Why are related rates so confusing? 😅',
    timestamp: '2h ago',
    likes: 15,
    comments: 9,
    similarity: 92
  },
  {
    id: '5',
    userId: 'User_7421',
    content: 'Anyone studying thermodynamics? The second law is fascinating but hard to grasp intuitively.',
    timestamp: '3h ago',
    likes: 19,
    comments: 6,
    similarity: 91
  },
];

export default function FeedPage() {
  // Handle comment submission
  const handleCommentSubmit = async (content: string) => {
    try {
      // TODO: Replace with actual API call to post comment
      console.log('Posting comment:', content);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just log the comment - in a real app this would:
      // 1. Send the comment to the backend API
      // 2. Update the local state/cache with the new comment
      // 3. Refresh the feed or optimistically update it
      console.log('Comment posted successfully:', content);
    } catch (error) {
      console.error('Failed to post comment:', error);
      throw new Error('Failed to post comment. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Feed Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-lg font-semibold text-foreground">Your Feed</h2>
        <p className="text-sm text-muted-foreground">Posts from users with high similarity scores</p>
      </div>

      {/* Comment Composer - positioned at top of feed content */}
      <div className="p-4 border-b border-border bg-background">
        <CommentComposer 
          onSubmit={handleCommentSubmit}
          placeholder="What's on your mind? Share your thoughts with fellow study buddies..."
          maxLength={500}
        />
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {mockPosts.map((post) => (
          <article key={post.id} className="p-4">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {post.userId.split('_')[1].slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{post.userId}</span>
                    <span className="text-xs text-green-400 font-semibold">
                      {post.similarity}% match
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-sm text-foreground mb-3 leading-relaxed">
              {post.content}
            </p>

            {/* Post Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-muted-foreground hover:bg-transparent group">
                <Heart className="h-4 w-4 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                <span className="text-xs">{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 text-muted-foreground hover:bg-transparent group">
                <MessageSquare className="h-4 w-4 group-hover:fill-blue-500 group-hover:text-blue-500 transition-all" />
                <span className="text-xs">{post.comments}</span>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
