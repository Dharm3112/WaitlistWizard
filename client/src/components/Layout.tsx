import { useLocation } from 'wouter';
import { Home, User, Hash, Globe, MessageSquare, UserPlus, MessageCircle, Plus, Settings as SettingsIcon, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SettingsModal } from './SettingsModal';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Hash, label: 'Echoes', path: '/echoes' },
    { icon: Globe, label: 'Global Chat', path: '/chat' },
    { icon: MessageSquare, label: 'Direct Message (DM)', path: '/dm' },
    { icon: UserPlus, label: 'Invite User for Private Chat', path: '/invite' },
    { icon: MessageCircle, label: 'Feedback', path: '/feedback' },
    { icon: Plus, label: 'Create Community', path: '/community/create' },
    { icon: Hash, label: 'Explore Community', path: '/community/explore' },
    { icon: Hash, label: 'Private Community', path: '/community/private' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
              I
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">IntelliCircle</h1>
              <p className="text-xs text-muted-foreground">Messaging Without Boundaries</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="mt-6 border-t border-sidebar-border pt-4">
            <div className="px-3 mb-2">
              <div className="text-xs text-muted-foreground mb-2">Joined Communities</div>
              <div className="text-xs text-sidebar-foreground">0</div>
            </div>
            <div className="px-3 mb-2">
              <div className="text-xs text-muted-foreground mb-2">My Communities</div>
              <div className="text-xs text-sidebar-foreground">0</div>
            </div>
          </div>

          {/* User Profile */}
          <div className="mt-4 border-t border-sidebar-border pt-4">
            <div className="flex items-center px-3 py-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                A
              </div>
              <div className="ml-2 flex-1">
                <div className="text-sm font-medium text-sidebar-foreground">astroid_distroyer</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-green-500">Online</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-sidebar-border space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Delete Account & Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Right Sidebar - Statistics */}
      <aside className="w-80 bg-sidebar border-l border-sidebar-border p-4 overflow-y-auto">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-sidebar-foreground flex items-center">
            <Hash className="h-5 w-5 mr-2" />
            Statistics
          </h3>

          {/* Total Users */}
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Total Users</span>
              </div>
              <span className="text-2xl font-bold text-blue-500">316</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All registered users in database
            </p>
          </div>

          {/* Active Users */}
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Active Users</span>
              </div>
              <span className="text-2xl font-bold text-green-500">0</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Currently online with active presence
            </p>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>

          {/* About Section */}
          <div className="mt-8 bg-card rounded-lg p-4">
            <button className="w-full flex items-center justify-between text-sidebar-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary">i</span>
                </div>
                <span className="text-sm font-medium">About IntelliCircle</span>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {/* <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} /> */}
    </div>
  );
}
