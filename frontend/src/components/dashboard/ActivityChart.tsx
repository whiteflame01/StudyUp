import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function ActivityChart() {
  // Mock data for the chart
  const data = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 4 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 5 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 6 },
    { day: 'Sun', hours: 1 },
  ];

  const maxHours = Math.max(...data.map(d => d.hours));

  return (
    <Card className="bg-white border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Study Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between h-32 gap-2">
            {data.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full bg-border rounded-t-sm relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-500"
                    style={{ 
                      height: `${(item.hours / maxHours) * 100}px`,
                      minHeight: item.hours > 0 ? '8px' : '0px'
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Total this week: <span className="font-medium text-foreground">23 hours</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}