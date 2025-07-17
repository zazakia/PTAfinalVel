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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Mobile Header */}
      <MobileHeader 
        onMenuToggle={handleMenuToggle}
        currentPageTitle={currentPage}
      />
      
      <div className="flex">
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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};