import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Recommendation } from '@/types';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onConnect: (userId: string) => void;
  className?: string;
}

export function RecommendationCard({ recommendation, onConnect, className }: RecommendationCardProps) {
  const { user, compatibilityScore, matchReasons } = recommendation;

  return (
    <Card className={cn("bg-white shadow-sm hover:shadow-md transition-shadow border", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm text-foreground truncate">{user.name}</h4>
              <span className="text-xs font-medium text-blue-600">
                {compatibilityScore}% match
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {user.profile?.subjects.slice(0, 2).join(', ')}
            </p>
            <div className="mb-3">
              <p className="text-xs text-muted-foreground">
                {matchReasons[0]}
              </p>
            </div>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => onConnect(user.id)}
            >
              Connect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}