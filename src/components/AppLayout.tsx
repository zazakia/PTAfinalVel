import React from 'react';
import { IncomeFormMain } from './IncomeForm/IncomeFormMain';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8">
        <IncomeFormMain />
      </div>
    </div>
  );
};

export default AppLayout;