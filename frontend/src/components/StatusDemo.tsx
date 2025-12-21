import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

/**
 * Demo component showing the new status colors and their accessibility compliance
 */
export function StatusDemo() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-foreground">Status Colors Demo</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Alert Components</h3>
        
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            This is a success message with proper contrast ratios for accessibility.
          </AlertDescription>
        </Alert>

        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This is a warning message that meets WCAG 2.1 AA standards.
          </AlertDescription>
        </Alert>

        <Alert variant="info">
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            This is an informational message with accessible color contrast.
          </AlertDescription>
        </Alert>

        <Alert variant="error">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            This is an error message that maintains readability in dark theme.
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Badge Components</h3>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Success Badge</Badge>
          <Badge variant="warning">Warning Badge</Badge>
          <Badge variant="info">Info Badge</Badge>
          <Badge variant="error">Error Badge</Badge>
          <Badge variant="default">Default Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="destructive">Destructive Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Accessibility Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>All status colors meet WCAG 2.1 AA contrast requirements</li>
          <li>Colors are distinguishable from each other for users with color vision deficiencies</li>
          <li>Status indicators work well on dark backgrounds</li>
          <li>Foreground text colors provide sufficient contrast on status backgrounds</li>
        </ul>
      </div>
    </div>
  );
}