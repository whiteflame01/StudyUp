import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Calendar,
  User,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockNotifications } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'feed' },
  { path: '/buddies', icon: Users, label: 'Find Buddies' },
  { path: '/chat', icon: MessageCircle, label: 'Messages', badge: 2 },
  { path: '/sessions', icon: Calendar, label: 'Sessions' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-5 border-b border-sidebar-border',
          collapsed && 'justify-center'
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-sidebar-foreground">Study Up</h1>
              <p className="text-xs text-sidebar-foreground/60">Find your study buddy</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'animate-scale-in')} />
                    {!collapsed && (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <Badge variant="destructive" className="h-5 min-w-[20px] px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Premium Card */}
          {!collapsed && (
            <div className="mt-6 rounded-xl bg-gradient-primary p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">Go Premium</span>
              </div>
              <p className="text-xs text-primary-foreground/80 mb-3">
                Unlock unlimited connections and advanced features
              </p>
              <Button size="sm" variant="secondary" className="w-full text-xs">
                Upgrade Now
              </Button>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border p-3">
          {/* Notifications */}
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
            {!collapsed && <span>Notifications</span>}
          </button>

          {/* Settings */}
          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          {/* User Profile */}
          {user && (
            <div className={cn(
              'mt-3 flex items-center gap-3 rounded-lg bg-sidebar-accent p-3',
              collapsed && 'justify-center p-2'
            )}>
              <Avatar className="h-9 w-9 border-2 border-sidebar-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0 animate-fade-in">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    @{user.username}
                  </p>
                </div>
              )}
              {!collapsed && (
                <Button 
                  variant="ghost" 
                  size="iconSm" 
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-sidebar-foreground" />
          )}
        </button>
      </div>
    </aside>
  );
}