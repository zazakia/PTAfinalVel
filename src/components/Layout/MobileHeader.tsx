import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  currentPageTitle: string;
}

const getPageTitle = (page: string): string => {
  switch (page) {
    case 'menu': return 'Dashboard';
    case 'income-form': return 'Income Form';
    case 'reports': return 'Reports';
    case 'kpi': return 'KPI Dashboard';
    case 'students': return 'Students';
    case 'settings': return 'Settings';
    default: return 'Dashboard';
  }
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  onMenuToggle, 
  currentPageTitle 
}) => {
  return (
    <header className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">
          {getPageTitle(currentPageTitle)}
        </h1>
      </div>
    </header>
  );
};