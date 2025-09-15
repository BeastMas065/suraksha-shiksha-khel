import React, { useState } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { LanguageProvider } from './LanguageSelector';

type LayoutProps = {
  children: React.ReactNode;
  userXP?: number;
  userLevel?: number;
};

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userXP = 1250, 
  userLevel = 5 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header 
          userXP={userXP} 
          userLevel={userLevel}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex">
          <Navigation 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)} 
          />
          <main className="flex-1 md:ml-0">
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
};