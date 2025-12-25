import { useState, useEffect } from 'react';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePost } from '@/components/feed/CreatePost';
import { postsApi } from '@/lib/api';
import type { Post } from '@/types/api';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostId, setNewPostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await postsApi.getPosts(1, 20);
      setPosts(response.data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost: Post) => {
    // Prepend the new post to the top of the list
    setPosts(prevPosts => [newPost, ...prevPosts]);
    
    // Set the new post ID for highlighting
    setNewPostId(newPost.id);
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setNewPostId(null);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Feed Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h2 className="text-lg font-semibold">Your Feed</h2>
        <p className="text-sm text-gray-500">Posts from your study community</p>
      </div>

      {/* Create Post */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Posts */}
      {isLoading ? (
        <div className="p-8 text-center text-gray-500">
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={fetchPosts}
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              isNew={post.id === newPostId}
            />
          ))}
        </div>
      )}
    </div>
  );
}