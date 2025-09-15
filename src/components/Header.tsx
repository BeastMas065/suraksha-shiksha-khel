import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector, useLanguage } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { 
  Bell, 
  Settings, 
  User, 
  Shield,
  Menu
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
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="sm" className="relative">
              <User className="h-5 w-5" />
            </Button>

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