import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, DollarSign, Settings, Database, CreditCard, History } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (page: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const menuItems = [
    {
      id: 'income-form',
      title: 'Income Entry',
      description: 'Record new income transactions',
      icon: DollarSign,
      color: 'bg-emerald-500 dark:bg-emerald-600'
    },
    {
      id: 'income-history',
      title: 'Income History',
      description: 'View all income transactions and history',
      icon: History,
      color: 'bg-indigo-500 dark:bg-indigo-600'
    },
    {
      id: 'expenses',
      title: 'Expenses',
      description: 'Record expense transactions',
      icon: CreditCard,
      color: 'bg-red-500 dark:bg-red-600'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'View income reports and analytics',
      icon: FileText,
      color: 'bg-blue-500 dark:bg-blue-600'
    },
    {
      id: 'kpi',
      title: 'KPI Dashboard',
      description: 'Key performance indicators',
      icon: BarChart3,
      color: 'bg-purple-500 dark:bg-purple-600'
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Manage master data and settings',
      icon: Database,
      color: 'bg-slate-500 dark:bg-slate-600'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      color: 'bg-gray-500 dark:bg-gray-600'
    }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          School Income Management
        </h1>
        <p className="text-muted-foreground mt-2 text-sm lg:text-base">Manage student payments and track income</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate(item.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                  </div>
                  <CardTitle className="text-base lg:text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs lg:text-sm">{item.description}</p>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  Open {item.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};