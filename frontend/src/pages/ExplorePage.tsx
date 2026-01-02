import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, UserPlus, TrendingUp, Clock, Loader2, MessageCircle } from 'lucide-react';
import { usersApi } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

interface Forum {
  id: string;
  name: string;
  description: string;
  members: number;
  similarity: number;
  posts: number;
  lastActive: string;
}

const mockForums: Forum[] = [
  { id: '1', name: 'Quantum Physics Deep Dive', description: 'Advanced discussions on quantum mechanics and particle physics', members: 342, similarity: 98, posts: 1240, lastActive: '2m ago' },
  { id: '2', name: 'Linear Algebra Mastery', description: 'Matrix operations, eigenvalues, and vector spaces', members: 289, similarity: 96, posts: 890, lastActive: '15m ago' },
  { id: '3', name: 'Organic Chemistry Lab', description: 'Reaction mechanisms and synthesis strategies', members: 456, similarity: 94, posts: 2100, lastActive: '30m ago' },
  { id: '4', name: 'Calculus Problem Solving', description: 'Integration, differentiation, and optimization problems', members: 567, similarity: 92, posts: 1800, lastActive: '1h ago' },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'forums' | 'users'>('forums');
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();

  // Fetch real users from the API
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
    enabled: activeTab === 'users', // Only fetch when users tab is active
  });

  const handleStartChat = (userId: string) => {
    // Navigate to messages page with this user selected
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
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-gray-600">Forums matched to your interests</p>
          </div>
          {mockForums.map((forum) => (
            <Card key={forum.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Hash className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{forum.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {forum.similarity}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{forum.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {forum.members} members
                      </span>
                      <span>{forum.posts} posts</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {forum.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="ml-2">Join</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Users Tab */}
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
        <h3 className="font-semibold text-sm mb-2">How Matching Works</h3>
        <p className="text-xs text-gray-600">
          {activeTab === 'forums' && 'Forums are ranked by how well their content matches your study patterns and interests.'}
          {activeTab === 'users' && 'Users are ranked by behavioral similarity - study habits, learning tempo, and topic overlap.'}
        </p>
      </Card>
    </div>
  );
}
