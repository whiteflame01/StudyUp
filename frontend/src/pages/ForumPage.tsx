import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePost } from '@/components/feed/CreatePost';
import { forumsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Hash, Loader2, Settings } from 'lucide-react';
import type { Post } from '@/types/api';

export default function ForumPage() {
  const { forumId } = useParams<{ forumId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostId, setNewPostId] = useState<string | null>(null);
  
  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPrivate, setEditIsPrivate] = useState(false);

  // Fetch forum details
  const { data: forumData, isLoading: isLoadingForum, error: forumError, refetch: refetchForum } = useQuery({
    queryKey: ['forum', forumId],
    queryFn: () => forumsApi.getForumById(forumId!),
    enabled: !!forumId,
  });

  // Fetch forum posts
  const { data: postsData, isLoading: isLoadingPosts, error: postsError } = useQuery({
    queryKey: ['forumPosts', forumId],
    queryFn: () => forumsApi.getForumPosts(forumId!, 1, 20),
    enabled: !!forumId,
  });

  // Update forum mutation
  const updateForumMutation = useMutation({
    mutationFn: (data: { name?: string; description?: string; isPrivate?: boolean }) =>
      forumsApi.updateForum(forumId!, data),
    onSuccess: async () => {
      // Immediately refetch forum data
      await refetchForum();
      // Invalidate both the specific forum and the forums list
      queryClient.invalidateQueries({ queryKey: ['forum', forumId] });
      queryClient.invalidateQueries({ queryKey: ['forums'] });
      setIsEditDialogOpen(false);
    },
  });

  useEffect(() => {
    if (postsData?.data.posts) {
      setPosts(postsData.data.posts);
    }
  }, [postsData]);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostId(newPost.id);
    setTimeout(() => setNewPostId(null), 3000);
  };

  const handleOpenEditDialog = async () => {
    // Refetch forum data to ensure we have the latest values
    const { data: latestData } = await refetchForum();
    const latestForum = latestData?.data.forum;
    
    if (latestForum) {
      setEditName(latestForum.name);
      setEditDescription(latestForum.description || '');
      setEditIsPrivate(latestForum.isPrivate);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateForumMutation.mutateAsync({
      name: editName,
      description: editDescription,
      isPrivate: editIsPrivate,
    });
  };

  if (!forumId) {
    return <div className="p-4 text-center">Forum not found</div>;
  }

  if (isLoadingForum) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (forumError || !forumData) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">Failed to load forum</p>
        <Button onClick={() => navigate('/app/explore')}>Go Back</Button>
      </div>
    );
  }

  const forum = forumData.data.forum;
  const isOwner = user?.id === forum.createdById;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Forum Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/app/explore')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Hash className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{forum.name}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {forum.memberCount} members
                </span>
                <span>{forum.postCount} posts</span>
                {forum.isPrivate && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    Private
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {forum.isMember && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Joined
              </Badge>
            )}
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenEditDialog}
                title="Edit forum"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        {forum.description && (
          <p className="text-sm text-gray-600 mt-2">{forum.description}</p>
        )}
      </div>

      {/* Edit Forum Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Forum</DialogTitle>
            <DialogDescription>
              Update your forum's name, description, and privacy settings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateForum}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-forum-name">Forum Name</Label>
                <Input
                  id="edit-forum-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter forum name"
                  required
                  minLength={3}
                  maxLength={80}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-forum-description">Description (optional)</Label>
                <Textarea
                  id="edit-forum-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe what this forum is about..."
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-forum-private"
                  checked={editIsPrivate}
                  onChange={(e) => setEditIsPrivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-forum-private" className="cursor-pointer">
                  Make forum private (only members can see and access it)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={updateForumMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateForumMutation.isPending}>
                {updateForumMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Forum'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Post - only show if member */}
      {forum.isMember && (
        <CreatePost onPostCreated={handlePostCreated} forumId={forumId} />
      )}

      {/* Posts */}
      {isLoadingPosts ? (
        <div className="p-8 text-center text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Loading posts...</p>
        </div>
      ) : postsError ? (
        <div className="p-8 text-center text-red-500">
          <p>Failed to load posts</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No posts yet. {forum.isMember ? 'Be the first to share something!' : 'Join to start posting!'}</p>
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
