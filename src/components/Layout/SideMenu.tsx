import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  DollarSign, 
  BarChart3, 
  FileText, 
  Settings,
  CreditCard,
  Database,
  History,
  X
} from 'lucide-react';

interface SideMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'menu', label: 'Dashboard', icon: Home },
  { id: 'income-form', label: 'Income Form', icon: DollarSign },
  { id: 'income-history', label: 'Income History', icon: History },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'kpi', label: 'KPI Dashboard', icon: BarChart3 },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const SideMenu: React.FC<SideMenuProps> = ({ 
  currentPage, 
  onNavigate, 
  isOpen, 
  onClose 
}) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">School Income</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
      
      <Separator />
      <div className="p-4">
        <p className="text-xs text-muted-foreground">
          School Management System v1.0
        </p>
      </div>
    </div>
  );
};