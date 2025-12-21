import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  MessageCircle, 
  Users,
  Hash,
  LogOut,
  Shield,
  Compass
} from 'lucide-react';

export default function MainPage() {
  const location = useLocation();
  const handleLogout = () => {
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold">Study Up</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1.5 hidden sm:flex">
              <Shield className="h-3 w-3" />
              <span className="font-mono text-xs">User_2847</span>
            </Badge>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 p-4">
          <nav className="space-y-1">
            <Button
              variant={isActive('/app/feed') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-12"
              asChild
            >
              <Link to="/app/feed">
                <Hash className="h-5 w-5" />
                <span className="text-base">Feed</span>
              </Link>
            </Button>

            <Button
              variant={isActive('/app/chats') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-12"
              asChild
            >
              <Link to="/app/chats">
                <MessageCircle className="h-5 w-5" />
                <span className="text-base">Chats</span>
              </Link>
            </Button>

            <Button
              variant={isActive('/app/messages') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-12"
              asChild
            >
              <Link to="/app/messages">
                <Users className="h-5 w-5" />
                <span className="text-base">Messages</span>
              </Link>
            </Button>

            <Button
              variant={isActive('/app/explore') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-12"
              asChild
            >
              <Link to="/app/explore">
                <Compass className="h-5 w-5" />
                <span className="text-base">Explore</span>
              </Link>
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-14">
          <Button
            variant="ghost"
            size="icon"
            className={isActive('/app/feed') ? 'text-blue-600' : 'text-gray-600'}
            asChild
          >
            <Link to="/app/feed">
              <Hash className="h-6 w-6" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={isActive('/app/chats') ? 'text-blue-600' : 'text-gray-600'}
            asChild
          >
            <Link to="/app/chats">
              <MessageCircle className="h-6 w-6" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={isActive('/app/explore') ? 'text-blue-600' : 'text-gray-600'}
            asChild
          >
            <Link to="/app/explore">
              <Compass className="h-6 w-6" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={isActive('/app/messages') ? 'text-blue-600' : 'text-gray-600'}
            asChild
          >
            <Link to="/app/messages">
              <Users className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}