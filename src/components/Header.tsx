import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LanguageSelector, useLanguage } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { 
  Bell, 
  Settings, 
  User, 
  Shield,
  Menu,
  LogOut
} from 'lucide-react';
import bugmintLogo from '@/assets/bugmint-logo.png';

type HeaderProps = {
  userXP?: number;
  userLevel?: number;
  onMenuClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ 
  userXP = 1250, 
  userLevel = 5,
  onMenuClick 
}) => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <img 
                src={bugmintLogo} 
                alt="BugMint Suraksha Logo" 
                className="h-10 w-10 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">
                  {t('appName')}
                </h1>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Disaster Preparedness Platform
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - XP Display (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/60 dark:bg-muted rounded-lg px-3 py-2 transition-colors duration-300">
              <Badge variant="outline" className="bg-primary text-white border-0">
                {t('level')} {userLevel}
              </Badge>
              <div className="text-sm">
                <span className="font-semibold text-primary">{userXP.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">{t('xp')}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                2
              </Badge>
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="flex flex-col items-start">
                  <div className="font-medium">{user?.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {user?.user_metadata?.display_name || 'User'}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile XP Display */}
            <div className="md:hidden">
              <Badge variant="outline" className="bg-primary text-white border-0">
                L{userLevel}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};