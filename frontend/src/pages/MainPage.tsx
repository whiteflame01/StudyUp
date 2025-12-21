import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  MessageCircle, 
  Users,
  Hash,
  Compass,
  LogOut
} from 'lucide-react';

export default function MainPage() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Study Up</span>
          </Link>
        </div>
      </header>

      <div className="flex pt-16 transition-all duration-200 ease-in-out">
        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-border bg-card p-4 transition-all duration-200 ease-in-out">
          {/* Main Navigation */}
          <nav className="space-y-1 flex-1">
            <Link to="/app/feed">
              <Button
                variant={isActive('/app/feed') ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12 transition-all duration-150 ease-in-out"
              >
                <Hash className="h-5 w-5" />
                <span className="text-base">Feed</span>
              </Button>
            </Link>

            <Link to="/app/chats">
              <Button
                variant={isActive('/app/chats') ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12 transition-all duration-150 ease-in-out"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-base">Chats</span>
              </Button>
            </Link>

            <Link to="/app/messages">
              <Button
                variant={isActive('/app/messages') ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12 transition-all duration-150 ease-in-out"
              >
                <Users className="h-5 w-5" />
                <span className="text-base">Messages</span>
              </Button>
            </Link>

            <Link to="/app/explore">
              <Button
                variant={isActive('/app/explore') ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12 transition-all duration-150 ease-in-out"
              >
                <Compass className="h-5 w-5" />
                <span className="text-base">Explore</span>
              </Button>
            </Link>
          </nav>

          {/* Bottom User Controls Section */}
          <div className="border-t border-border pt-4 mt-4 transition-all duration-200 ease-in-out">
            {/* User Name Display */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-150 ease-in-out">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  @{user?.username || 'username'}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 ease-in-out"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-base">Sign out</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen pb-14 md:pb-0 transition-all duration-200 ease-in-out">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 transition-all duration-200 ease-in-out">
        <div className="flex items-center h-14">
          {/* Navigation Items */}
          <div className="flex items-center justify-around flex-1">
            <Link to="/app/feed">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-150 ease-in-out ${isActive('/app/feed') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Hash className="h-6 w-6" />
              </Button>
            </Link>
            <Link to="/app/chats">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-150 ease-in-out ${isActive('/app/chats') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </Link>
            <Link to="/app/explore">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-150 ease-in-out ${isActive('/app/explore') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Compass className="h-6 w-6" />
              </Button>
            </Link>
            <Link to="/app/messages">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-150 ease-in-out ${isActive('/app/messages') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Users className="h-6 w-6" />
              </Button>
            </Link>
          </div>
          
          {/* User Controls Section */}
          <div className="flex items-center border-l border-border pl-2 pr-3 transition-all duration-200 ease-in-out">
            {/* User Avatar/Profile Button */}
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center transition-all duration-150 ease-in-out">
                <span className="text-primary-foreground text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate max-w-20">
                  {user?.name || 'User'}
                </span>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground hover:bg-accent ml-1 transition-all duration-150 ease-in-out"
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}