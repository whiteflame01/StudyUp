import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CommentComposer } from '@/components/feed/CommentComposer';
import { 
  Heart,
  MessageSquare,
  Send
} from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  postId: string;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  similarity: number;
  isLiked?: boolean; // Track if current user has liked this post
}

const initialMockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'User_5432',
    content: 'I struggled with this too! The key insight is that entanglement creates correlations that can\'t be explained by classical physics.',
    timestamp: '1m ago',
    postId: '1'
  },
  {
    id: 'c2',
    userId: 'User_9876',
    content: 'Check out the Bell inequality experiments - they really help visualize what\'s happening.',
    timestamp: '30s ago',
    postId: '1'
  },
  {
    id: 'c3',
    userId: 'User_1234',
    content: 'Think of eigenvalues as the "natural" scaling factors for a transformation. They tell you how much the transformation stretches or shrinks vectors in certain directions.',
    timestamp: '10m ago',
    postId: '2'
  },
  {
    id: 'c4',
    userId: 'User_7890',
    content: 'Great analogy! I like to think of them as the "preferred directions" of a matrix.',
    timestamp: '8m ago',
    postId: '2'
  },
  {
    id: 'c5',
    userId: 'User_4567',
    content: 'Yes! Once you see the electron flow patterns, everything clicks. It\'s like seeing the matrix code 😄',
    timestamp: '45m ago',
    postId: '3'
  }
];

const initialMockPosts: Post[] = [
  {
    id: '1',
    userId: 'User_8492',
    content: 'Just finished studying quantum entanglement. The concept of non-locality is mind-blowing. Anyone else working through Chapter 3?',
    timestamp: '2m ago',
    likes: 12,
    comments: 3,
    similarity: 98,
    isLiked: false
  },
  {
    id: '2',
    userId: 'User_3721',
    content: 'Can someone explain why eigenvalues are so important in linear algebra? I get the math but struggling with the intuition.',
    timestamp: '15m ago',
    likes: 8,
    comments: 5,
    similarity: 96,
    isLiked: false
  },
  {
    id: '3',
    userId: 'User_5634',
    content: 'Organic chemistry reactions making sense now after 3 hours. The key is understanding electron flow patterns!',
    timestamp: '1h ago',
    likes: 24,
    comments: 7,
    similarity: 94,
    isLiked: false
  },
  {
    id: '4',
    userId: 'User_2193',
    content: 'Working on calculus optimization problems. Why are related rates so confusing? 😅',
    timestamp: '2h ago',
    likes: 15,
    comments: 9,
    similarity: 92,
    isLiked: false
  },
  {
    id: '5',
    userId: 'User_7421',
    content: 'Anyone studying thermodynamics? The second law is fascinating but hard to grasp intuitively.',
    timestamp: '3h ago',
    likes: 19,
    comments: 6,
    similarity: 91,
    isLiked: false
  },
];

export default function FeedPage() {
  // State to manage posts with like functionality
  const [posts, setPosts] = useState<Post[]>(initialMockPosts);
  const [comments, setComments] = useState<Comment[]>(initialMockComments);
  const [openCommentSections, setOpenCommentSections] = useState<Set<string>>(new Set());
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});

  // Handle comment submission for main feed composer
  const handleMainCommentSubmit = async (content: string) => {
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

  // Handle like/unlike functionality
  const handleLikeToggle = async (postId: string) => {
    try {
      // Optimistically update the UI first
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isCurrentlyLiked = post.isLiked;
            return {
              ...post,
              isLiked: !isCurrentlyLiked,
              likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
            };
          }
          return post;
        })
      );

      // TODO: Replace with actual API call to like/unlike post
      console.log(`Toggling like for post ${postId}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`Like toggled successfully for post ${postId}`);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      
      // Revert the optimistic update on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isCurrentlyLiked = post.isLiked;
            return {
              ...post,
              isLiked: !isCurrentlyLiked,
              likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
            };
          }
          return post;
        })
      );
    }
  };

  // Handle comment section toggle
  const handleCommentToggle = (postId: string) => {
    setOpenCommentSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Handle new comment submission for individual posts
  const handlePostCommentSubmit = async (postId: string) => {
    const content = newCommentContent[postId]?.trim();
    if (!content) return;

    try {
      // Create new comment
      const newComment: Comment = {
        id: `c${Date.now()}`,
        userId: 'You', // In a real app, this would be the current user
        content,
        timestamp: 'now',
        postId
      };

      // Optimistically update comments
      setComments(prev => [...prev, newComment]);
      
      // Update post comment count
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );

      // Clear the input
      setNewCommentContent(prev => ({ ...prev, [postId]: '' }));

      // TODO: Replace with actual API call
      console.log('Posting comment:', content, 'for post:', postId);
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Comment posted successfully');
    } catch (error) {
      console.error('Failed to post comment:', error);
      // Revert optimistic updates on error
      setComments(prev => prev.filter(c => c.id !== `c${Date.now()}`));
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, comments: post.comments - 1 }
            : post
        )
      );
    }
  };

  // Handle comment input change
  const handleCommentInputChange = (postId: string, value: string) => {
    setNewCommentContent(prev => ({ ...prev, [postId]: value }));
  };

  // Get comments for a specific post
  const getPostComments = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
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
          onSubmit={handleMainCommentSubmit}
          placeholder="What's on your mind? Share your thoughts with fellow study buddies..."
          maxLength={500}
        />
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {posts.map((post) => (
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
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 h-8 px-2 transition-all group ${
                  post.isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-muted-foreground hover:text-red-500'
                } hover:bg-transparent`}
                onClick={() => handleLikeToggle(post.id)}
              >
                <Heart 
                  className={`h-4 w-4 transition-all ${
                    post.isLiked 
                      ? 'fill-red-500 text-red-500' 
                      : 'group-hover:fill-red-500 group-hover:text-red-500'
                  }`} 
                />
                <span className="text-xs">{post.likes}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 h-8 px-2 transition-all group ${
                  openCommentSections.has(post.id)
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-muted-foreground hover:text-blue-500'
                } hover:bg-transparent`}
                onClick={() => handleCommentToggle(post.id)}
              >
                <MessageSquare 
                  className={`h-4 w-4 transition-all ${
                    openCommentSections.has(post.id)
                      ? 'fill-blue-500 text-blue-500'
                      : 'group-hover:fill-blue-500 group-hover:text-blue-500'
                  }`} 
                />
                <span className="text-xs">{post.comments}</span>
              </Button>
            </div>

            {/* Comments Section */}
            {openCommentSections.has(post.id) && (
              <div className="mt-4 border-t border-border pt-4">
                {/* Existing Comments */}
                <div className="space-y-3 mb-4">
                  {getPostComments(post.id).map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-xs">
                          {comment.userId === 'You' ? 'Y' : comment.userId.split('_')[1]?.slice(0, 2) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs text-foreground">
                            {comment.userId}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Comment Input */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">Y</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newCommentContent[post.id] || ''}
                      onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                      className="min-h-[60px] resize-none text-sm"
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                          e.preventDefault();
                          handlePostCommentSubmit(post.id);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handlePostCommentSubmit(post.id)}
                      disabled={!newCommentContent[post.id]?.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
