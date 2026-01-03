import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, Loader2 } from 'lucide-react';
import { forumsApi } from '@/lib/api';

export default function MyForumsPage() {
  const navigate = useNavigate();

  // Fetch forums from API
  const { data: forumsData, isLoading: isLoadingForums, error: forumsError } = useQuery({
    queryKey: ['forums'],
    queryFn: () => forumsApi.getForums(),
  });

  // Filter only joined forums
  const joinedForums = forumsData?.data.forums.filter(forum => forum.isMember) || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h2 className="text-lg font-semibold">My Forums</h2>
        <p className="text-sm text-gray-600 mt-1">Forums you've joined</p>
      </div>

      {/* Forums Content */}
      <div className="p-4 space-y-3">
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

        {!isLoadingForums && joinedForums.length === 0 && (
          <div className="text-center py-12">
            <Hash className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-sm text-gray-600 mb-4">You haven't joined any forums yet.</p>
            <Button onClick={() => navigate('/app/explore')}>
              Explore Forums
            </Button>
          </div>
        )}

        {joinedForums.map((forum) => (
          <Card key={forum.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base">{forum.name}</h3>
                    {forum.isPrivate && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        Private
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Joined
                    </Badge>
                  </div>
                  {forum.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {forum.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {forum.memberCount} members
                    </span>
                    <span>{forum.postCount} posts</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="default"
                size="sm" 
                onClick={() => navigate(`/app/forums/${forum.id}`)}
              >
                View
              </Button>
            </div>
          </Card>
        ))}

        {/* Info Card */}
        {joinedForums.length > 0 && (
          <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-sm mb-2">Your Communities</h3>
            <p className="text-xs text-gray-600">
              These are the forums you've joined. Click on any forum to view posts and participate in discussions.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
