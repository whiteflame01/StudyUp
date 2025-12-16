import { useAuth } from '@/hooks/useAuth';
import HomePage from '@/pages/HomePage';
import { Navigate } from 'react-router-dom';

export function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, redirect to feed
  if (isAuthenticated) {
    return <Navigate to="/app/feed" replace />;
  }

  // If not authenticated, show home page
  return <HomePage />;
}
