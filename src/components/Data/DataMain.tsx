import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, UserCheck, Package, Settings, Database } from 'lucide-react';

interface DataMainProps {
  onNavigate: (page: string) => void;
}

export const DataMain: React.FC<DataMainProps> = ({ onNavigate }) => {
  const dataMenuItems = [
    {
      id: 'data-parents',
      title: 'Parents/Guardians',
      description: 'Manage parent and guardian information',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'data-students',
      title: 'Students',
      description: 'Manage student records and information',
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      id: 'data-teachers',
      title: 'Teachers & Sections',
      description: 'Manage teachers and class sections',
      icon: UserCheck,
      color: 'bg-purple-500'
    },
    {
      id: 'data-items',
      title: 'Items',
      description: 'Manage fee items and pricing',
      icon: Package,
      color: 'bg-orange-500'
    },
    {
      id: 'data-users',
      title: 'Users & Roles',
      description: 'Manage system users and permissions',
      icon: Settings,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg bg-slate-500 text-white">
            <Database className="h-6 w-6" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold">Data Management</h1>
        </div>
        <p className="text-muted-foreground text-sm lg:text-base">
          Manage master data for parents, students, teachers, items, and users
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {dataMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => onNavigate(item.id)}
            >
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
                  Manage {item.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};