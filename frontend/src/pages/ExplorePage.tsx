import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, UserPlus, TrendingUp, Clock } from 'lucide-react';

interface Forum {
  id: string;
  name: string;
  description: string;
  members: number;
  similarity: number;
  posts: number;
  lastActive: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  similarity: number;
  topic: string;
}

interface User {
  id: string;
  userId: string;
  similarity: number;
  currentTopic: string;
  studyStreak: number;
  online: boolean;
}

const mockForums: Forum[] = [
  { id: '1', name: 'Quantum Physics Deep Dive', description: 'Advanced discussions on quantum mechanics and particle physics', members: 342, similarity: 98, posts: 1240, lastActive: '2m ago' },
  { id: '2', name: 'Linear Algebra Mastery', description: 'Matrix operations, eigenvalues, and vector spaces', members: 289, similarity: 96, posts: 890, lastActive: '15m ago' },
  { id: '3', name: 'Organic Chemistry Lab', description: 'Reaction mechanisms and synthesis strategies', members: 456, similarity: 94, posts: 2100, lastActive: '30m ago' },
  { id: '4', name: 'Calculus Problem Solving', description: 'Integration, differentiation, and optimization problems', members: 567, similarity: 92, posts: 1800, lastActive: '1h ago' },
];

const mockGroups: Group[] = [
  { id: '1', name: 'QM Study Session', description: 'Weekly quantum mechanics problem-solving', members: 12, similarity: 97, topic: 'Quantum Mechanics' },
  { id: '2', name: 'Algebra Warriors', description: 'Daily linear algebra practice', members: 8, similarity: 95, topic: 'Linear Algebra' },
  { id: '3', name: 'Chem Lab Partners', description: 'Organic chemistry lab prep and review', members: 15, similarity: 93, topic: 'Chemistry' },
  { id: '4', name: 'Calculus Crushers', description: 'Intensive calculus study group', members: 10, similarity: 91, topic: 'Calculus' },
];

const mockUsers: User[] = [
  { id: '1', userId: 'User_8492', similarity: 98, currentTopic: 'Quantum Entanglement', studyStreak: 45, online: true },
  { id: '2', userId: 'User_3721', similarity: 96, currentTopic: 'Matrix Eigenvalues', studyStreak: 32, online: true },
  { id: '3', userId: 'User_5634', similarity: 94, currentTopic: 'Organic Reactions', studyStreak: 28, online: false },
  { id: '4', userId: 'User_2193', similarity: 92, currentTopic: 'Optimization Problems', studyStreak: 21, online: true },
  { id: '5', userId: 'User_7421', similarity: 91, currentTopic: 'Thermodynamics', studyStreak: 18, online: false },
  { id: '6', userId: 'User_9156', similarity: 89, currentTopic: 'Differential Equations', studyStreak: 15, online: true },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'forums' | 'groups' | 'users'>('forums');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-lg font-semibold text-foreground mb-3">Explore</h2>
        
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
            variant={activeTab === 'groups' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('groups')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Groups
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
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Forums matched to your interests</p>
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
                      <h3 className="font-semibold text-sm text-foreground">{forum.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        {forum.similarity}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{forum.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Study groups matched to your behavior</p>
          </div>
          {mockGroups.map((group) => (
            <Card key={group.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground">{group.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        {group.similarity}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{group.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">{group.topic}</Badge>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.members} members
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
      {activeTab === 'users' && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">Users with high similarity scores</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockUsers.map((user) => (
              <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {user.userId.split('_')[1].slice(0, 2)}
                      </span>
                    </div>
                    {user.online && (
                      <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{user.userId}</h3>
                    <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      {user.similarity}% match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Currently studying: <span className="font-medium text-foreground">{user.currentTopic}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    🔥 {user.studyStreak} day streak
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="m-4 p-4 bg-muted border-border">
        <h3 className="font-semibold text-sm text-foreground mb-2">How Matching Works</h3>
        <p className="text-xs text-muted-foreground">
          {activeTab === 'forums' && 'Forums are ranked by how well their content matches your study patterns and interests.'}
          {activeTab === 'groups' && 'Groups are matched based on your learning pace, study schedule, and topic preferences.'}
          {activeTab === 'users' && 'Users are ranked by behavioral similarity - study habits, learning tempo, and topic overlap.'}
        </p>
      </Card>
    </div>
  );
}
