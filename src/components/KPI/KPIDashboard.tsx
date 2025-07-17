import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Target, CreditCard } from 'lucide-react';
import { IncomeTransaction, ExpenseTransaction, Student, Parent } from '@/types';

interface KPIDashboardProps {
  incomeTransactions: IncomeTransaction[];
  expenseTransactions: ExpenseTransaction[];
  students: Student[];
  parents: Parent[];
}

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ 
  incomeTransactions, 
  expenseTransactions, 
  students, 
  parents 
}) => {
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const thisMonthIncome = incomeTransactions
    .filter(t => t.date >= thisMonth)
    .reduce((sum, t) => sum + t.total, 0);
  
  const thisMonthExpenses = expenseTransactions
    .filter(t => t.date >= thisMonth)
    .reduce((sum, t) => sum + t.total, 0);

  const lastMonthIncome = incomeTransactions
    .filter(t => t.date >= lastMonth && t.date <= lastMonthEnd)
    .reduce((sum, t) => sum + t.total, 0);

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.total, 0);
  const netIncome = totalIncome - totalExpenses;
  const incomeGrowth = lastMonthIncome > 0 ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;

  const avgTransactionValue = incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0;
  const activeParents = new Set(incomeTransactions.map(t => t.parentId)).size;
  const totalStudents = students.length;
  const paidStudents = new Set(incomeTransactions.flatMap(t => t.studentIds)).size;
  const paymentRate = totalStudents > 0 ? (paidStudents / totalStudents) * 100 : 0;

  const monthlyTarget = 50000;
  const targetProgress = (thisMonthIncome / monthlyTarget) * 100;

  const getParentName = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId);
    return parent ? `${parent.firstName} ${parent.lastName}` : 'Unknown';
  };

  const getStudentNames = (studentIds: string[]) => {
    return studentIds.map(id => {
      const student = students.find(s => s.id === id);
      return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
    });
  };

  const kpiCards = [
    {
      title: 'Monthly Income',
      value: `$${thisMonthIncome.toFixed(2)}`,
      change: incomeGrowth,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Expenses',
      value: `$${thisMonthExpenses.toFixed(2)}`,
      change: 0,
      icon: CreditCard,
      color: 'text-red-600'
    },
    {
      title: 'Net Income',
      value: `$${netIncome.toFixed(2)}`,
      change: 0,
      icon: TrendingUp,
      color: netIncome >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Active Parents',
      value: activeParents.toString(),
      change: 0,
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">KPI Dashboard</h2>
        <p className="text-muted-foreground">Key performance indicators and financial metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.change !== 0 && (
                  <div className="flex items-center mt-1">
                    {kpi.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${kpi.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(kpi.change).toFixed(1)}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Monthly Target Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: ${thisMonthIncome.toFixed(2)}</span>
                <span>Target: ${monthlyTarget.toFixed(2)}</span>
              </div>
              <Progress value={Math.min(targetProgress, 100)} className="h-2" />
              <div className="text-center text-sm text-muted-foreground">
                {targetProgress.toFixed(1)}% of monthly target
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Student Payment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Paid: {paidStudents}</span>
                <span>Total: {totalStudents}</span>
              </div>
              <Progress value={paymentRate} className="h-2" />
              <div className="text-center text-sm text-muted-foreground">
                {paymentRate.toFixed(1)}% of students have made payments
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Income Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incomeTransactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{getParentName(transaction.parentId)}</p>
                  <p className="text-sm text-muted-foreground">
                    {getStudentNames(transaction.studentIds).join(', ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.loggedUser} - {transaction.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +${transaction.total.toFixed(2)}
                  </Badge>
                </div>
              </div>
            ))}
            {incomeTransactions.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No recent transactions</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};