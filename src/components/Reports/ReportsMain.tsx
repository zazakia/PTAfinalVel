import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, FileText, Download, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IncomeTransaction, ExpenseTransaction, Parent, Student } from '@/types';

interface ReportsMainProps {
  incomeTransactions: IncomeTransaction[];
  expenseTransactions: ExpenseTransaction[];
  parents: Parent[];
  students: Student[];
}

export const ReportsMain: React.FC<ReportsMainProps> = ({ 
  incomeTransactions, 
  expenseTransactions, 
  parents, 
  students 
}) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredIncomeTransactions = incomeTransactions.filter(t => {
    try {
      const transactionDate = new Date(t.date);
      if (isNaN(transactionDate.getTime())) return dateFilter === 'all';
      
      const dateMatch = dateFilter === 'all' || 
        (dateFilter === 'today' && transactionDate.toDateString() === new Date().toDateString()) ||
        (dateFilter === 'week' && transactionDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === 'month' && transactionDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      return dateMatch;
    } catch (error) {
      console.warn('Invalid date in income transaction:', t.date);
      return dateFilter === 'all';
    }
  });

  const filteredExpenseTransactions = expenseTransactions.filter(t => {
    try {
      const transactionDate = new Date(t.date);
      if (isNaN(transactionDate.getTime())) return dateFilter === 'all';
      
      const dateMatch = dateFilter === 'all' || 
        (dateFilter === 'today' && transactionDate.toDateString() === new Date().toDateString()) ||
        (dateFilter === 'week' && transactionDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === 'month' && transactionDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      return dateMatch;
    } catch (error) {
      console.warn('Invalid date in expense transaction:', t.date);
      return dateFilter === 'all';
    }
  });

  const totalIncome = filteredIncomeTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpenses = filteredExpenseTransactions.reduce((sum, t) => sum + t.total, 0);
  const netIncome = totalIncome - totalExpenses;

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

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.warn('Error formatting date:', date);
      return 'Invalid Date';
    }
  };

  const displayTransactions = typeFilter === 'expenses' ? [] : filteredIncomeTransactions;
  const displayExpenses = typeFilter === 'income' ? [] : filteredExpenseTransactions;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">View and analyze income and expense transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expenses">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredIncomeTransactions.length + filteredExpenseTransactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayTransactions.map(transaction => (
              <div key={transaction.id} className="border rounded-lg p-4 border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{getParentName(transaction.parentId)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)} - {transaction.loggedUser}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +${transaction.total.toFixed(2)}
                  </Badge>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium">Students:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getStudentNames(transaction.studentIds).map(name => (
                      <Badge key={name} variant="outline" className="text-xs">{name}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Items:</p>
                  <div className="mt-1 space-y-1">
                    {transaction.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {transaction.receiptImage && (
                  <div className="mt-2">
                    <img src={transaction.receiptImage} alt="Receipt" className="w-16 h-16 object-cover rounded" />
                  </div>
                )}
              </div>
            ))}
            
            {displayExpenses.map(expense => (
              <div key={expense.id} className="border rounded-lg p-4 border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Expense</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date)} - {expense.loggedUser}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    -${expense.total.toFixed(2)}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Items:</p>
                  <div className="mt-1 space-y-1">
                    {expense.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>${item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {expense.receiptImage && (
                  <div className="mt-2">
                    <img src={expense.receiptImage} alt="Receipt" className="w-16 h-16 object-cover rounded" />
                  </div>
                )}
              </div>
            ))}
            
            {displayTransactions.length === 0 && displayExpenses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found for the selected filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};