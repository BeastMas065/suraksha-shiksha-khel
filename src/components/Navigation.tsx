import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  BookOpen,
  Gamepad2,
  Phone,
  Users,
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from './LanguageSelector';

const navigationItems = [
  { id: 'dashboard', label: 'dashboard', icon: Home, path: '/' },
  { id: 'games', label: 'games', icon: Gamepad2, path: '/games' },
  { id: 'emergency', label: 'emergency', icon: Phone, path: '/emergency' },
  { id: 'admin', label: 'admin', icon: Users, path: '/admin' },
];

type NavigationProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onToggle(); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border
        transform transition-all duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:top-0 md:h-screen md:translate-x-0
        dark:bg-card dark:border-border
      `}>
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <h2 className="font-semibold text-lg">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Button
                  key={item.id}
                  variant={active ? "default" : "ghost"}
                  className={`w-full justify-start h-12 transition-all duration-200 ${
                    active 
                      ? 'bg-gradient-primary text-white shadow-glow hover:shadow-glow' 
                      : 'hover:bg-muted text-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">{t(item.label)}</span>
                  {active && <ChevronRight className="h-4 w-4" />}
                </Button>
              );
            })}
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="bg-muted/50 dark:bg-muted rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">राज पटेल</span>
                <Badge variant="outline" className="bg-primary text-white border-0 text-xs">
                  Level 5
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>1,250 XP</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="h-2 bg-primary rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            
            <Button variant="ghost" className="w-full mt-3 justify-start">
              <Settings className="h-4 w-4 mr-3" />
              {t('settings')}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};