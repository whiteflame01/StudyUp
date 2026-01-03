import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, UserPlus, TrendingUp, Loader2, MessageCircle, Plus } from 'lucide-react';
import { usersApi, forumsApi } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Forum } from '@/types/api';

const mockGroups: never[] = [];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'forums' | 'users'>('forums');
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Forum creation dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [forumName, setForumName] = useState('');
  const [forumDescription, setForumDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Fetch forums from API
  const { data: forumsData, isLoading: isLoadingForums, error: forumsError } = useQuery({
    queryKey: ['forums'],
    queryFn: () => forumsApi.getForums(),
  });

  // Create forum mutation
  const createForumMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; isPrivate?: boolean }) => forumsApi.createForum(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['forums'] });
      setIsCreateDialogOpen(false);
      setForumName('');
      setForumDescription('');
      setIsPrivate(false);
      toast({
        title: 'Success',
        description: 'Forum created successfully!',
      });
      // Navigate to the new forum
      navigate(`/app/forums/${response.data.forum.id}`);
    },
    onError: (error) => {
      console.error('Error creating forum:', error);
      toast({
        title: 'Error',
        description: 'Failed to create forum. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Join forum mutation
  const joinForumMutation = useMutation({
    mutationFn: (forumId: string) => forumsApi.joinForum(forumId),
    onSuccess: (_, forumId) => {
      queryClient.invalidateQueries({ queryKey: ['forums'] });
      toast({
        title: 'Success',
        description: 'You have joined the forum!',
      });
      // Navigate to forum page
      navigate(`/app/forums/${forumId}`);
    },
    onError: (error) => {
      console.error('Error joining forum:', error);
      toast({
        title: 'Error',
        description: 'Failed to join forum. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateForum = () => {
    if (!forumName.trim()) {
      toast({
        title: 'Error',
        description: 'Forum name is required',
        variant: 'destructive',
      });
      return;
    }
    createForumMutation.mutate({
      name: forumName.trim(),
      description: forumDescription.trim() || undefined,
      isPrivate,
    });
  };

  // Fetch real users from the API
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
    enabled: activeTab === 'users',
  });

  const handleStartChat = (userId: string) => {
    navigate('/app/messages', { state: { selectedUserId: userId } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h2 className="text-lg font-semibold mb-3">Explore</h2>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'forums' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('forums')}
            className="gap-2"
          >
            <Hash className="h-4 w-4" />
            Forums
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('users')}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Users
          </Button>
        </div>
      </div>

      {/* Forums Tab */}
      {activeTab === 'forums' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-600">Join forums to connect with study communities</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Forum
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Forum</DialogTitle>
                  <DialogDescription>
                    Create a forum to start discussions on any topic you're interested in.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="forum-name">Forum Name *</Label>
                    <Input
                      id="forum-name"
                      placeholder="e.g., Quantum Physics Discussion"
                      value={forumName}
                      onChange={(e) => setForumName(e.target.value)}
                      maxLength={80}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="forum-description">Description</Label>
                    <Textarea
                      id="forum-description"
                      placeholder="What is this forum about?"
                      value={forumDescription}
                      onChange={(e) => setForumDescription(e.target.value)}
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="forum-private"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="forum-private" className="cursor-pointer">
                      Make this forum private (only members can see posts)
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createForumMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateForum}
                    disabled={createForumMutation.isPending || !forumName.trim()}
                  >
                    {createForumMutation.isPending ? 'Creating...' : 'Create Forum'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingForums && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {forumsError && (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">Failed to load forums. Please try again.</p>
            </div>
          )}

          {forumsData && forumsData.data.forums.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-600">No forums yet. Be the first to create one!</p>
            </div>
          )}

          {forumsData && forumsData.data.forums.map((forum) => (
            <Card key={forum.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Hash className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{forum.name}</h3>
                      {forum.isPrivate && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          Private
                        </Badge>
                      )}
                      {forum.isMember && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Joined
                        </Badge>
                      )}
                    </div>
                    {forum.description && (
                      <p className="text-xs text-gray-600 mb-2">{forum.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {forum.memberCount} members
                      </span>
                      <span>{forum.postCount} posts</span>
                    </div>
                  </div>
                </div>
                {forum.isMember ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/app/forums/${forum.id}`)}
                  >
                    View
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => joinForumMutation.mutate(forum.id)}
                    disabled={joinForumMutation.isPending}
                  >
                    {joinForumMutation.isPending ? 'Joining...' : 'Join'}
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {/* How It Works */}
          <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-sm mb-2">How It Works</h3>
            <p className="text-xs text-gray-600">
              Join forums to discuss topics you're interested in. Anyone can create a forum and post within it.
            </p>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-gray-600">Connect with study buddies</p>
          </div>

          {isLoadingUsers && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {usersError && (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">Failed to load users. Please try again.</p>
            </div>
          )}

          {usersData && usersData.data.users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-600">No users found yet.</p>
            </div>
          )}

          {usersData && usersData.data.users.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {usersData.data.users.map((user) => {
                const isOnline = onlineUsers.includes(user.id);
                
                return (
                  <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        {user.profile?.avatarUrl ? (
                          <img 
                            src={user.profile.avatarUrl} 
                            alt={user.username}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {user.username.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="mb-2">
                        <h3 className="font-semibold text-sm mb-1">@{user.username}</h3>
                        {user.profile?.major && (
                          <Badge variant="secondary" className="text-xs">
                            {user.profile.major}
                          </Badge>
                        )}
                      </div>
                      {user.profile?.bio && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {user.profile.bio}
                        </p>
                      )}
                      {user.profile?.college && (
                        <p className="text-xs text-gray-500 mb-2">
                          🎓 {user.profile.college}
                        </p>
                      )}
                      {user.profile?.year && (
                        <p className="text-xs text-gray-500 mb-3">
                          📚 {user.profile.year}
                        </p>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => handleStartChat(user.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      <Card className="m-4 p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-sm mb-2">How It Works</h3>
        <p className="text-xs text-gray-600">
          {activeTab === 'forums' && 'Browse and join forums to discuss topics you\'re interested in.'}
          {activeTab === 'users' && 'Connect with other students by sending them a message. Build your study network!'}
        </p>
      </Card>
    </div>
  );
}
