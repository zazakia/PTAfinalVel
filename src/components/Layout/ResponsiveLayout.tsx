import React, { useState } from 'react';
import { SideMenu } from './SideMenu';
import { MobileHeader } from './MobileHeader';

interface ResponsiveLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  currentPage,
  onNavigate,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 animate-gradient-x"></div>
      {/* Mobile Header */}
      <div className="relative z-10">
        <MobileHeader 
          onMenuToggle={handleMenuToggle}
          currentPageTitle={currentPage}
        />
      </div>
      
      <div className="flex relative z-10">
        {/* Side Menu */}
        <SideMenu 
          currentPage={currentPage}
          onNavigate={onNavigate}
          isOpen={isMobileMenuOpen}
          onClose={handleMenuClose}
        />
        
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleMenuClose}
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="container mx-auto p-4 lg:p-6">
            <div className="relative">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};