import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import ExpenseFormMain from './ExpenseFormMain';
import { ExpenseTransaction, CostCenter } from '@/types';

interface ExpensesMainProps {
  expenses: ExpenseTransaction[];
  costCenters: CostCenter[];
  onSaveExpense: (expense: ExpenseTransaction) => void;
  onAddCostCenter: (costCenter: CostCenter) => void;
}

export default function ExpensesMain({ 
  expenses, 
  costCenters, 
  onSaveExpense, 
  onAddCostCenter 
}: ExpensesMainProps) {
  const [showForm, setShowForm] = useState(false);
  const [newCostCenter, setNewCostCenter] = useState({ name: '', code: '', description: '' });

  const handleSaveExpense = (expense: ExpenseTransaction) => {
    onSaveExpense(expense);
    setShowForm(false);
  };

  const handleAddCostCenter = () => {
    if (newCostCenter.name && newCostCenter.code) {
      const costCenter: CostCenter = {
        id: Date.now().toString(),
        ...newCostCenter
      };
      onAddCostCenter(costCenter);
      setNewCostCenter({ name: '', code: '', description: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="cost-centers">Cost Centers</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          {showForm && (
            <div className="mb-6">
              <ExpenseFormMain 
                costCenters={costCenters} 
                onSave={handleSaveExpense} 
              />
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <p className="text-gray-500">No expenses recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="border p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">${expense.total.toFixed(2)}</h3>
                          <p className="text-sm text-gray-600">{expense.description}</p>
                          <p className="text-xs text-gray-500">
                            {expense.date.toLocaleDateString()} - {expense.loggedUser}
                          </p>
                        </div>
                        {expense.receiptImage && (
                          <img 
                            src={expense.receiptImage} 
                            alt="Receipt" 
                            className="w-16 h-16 object-cover rounded" 
                          />
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Items:</p>
                        {expense.items.map((item) => (
                          <div key={item.id} className="text-sm text-gray-600 ml-2">
                            {item.name} - ${item.amount.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost-centers">
          <Card>
            <CardHeader>
              <CardTitle>Add Cost Center</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  className="px-3 py-2 border rounded"
                  placeholder="Name"
                  value={newCostCenter.name}
                  onChange={(e) => setNewCostCenter({...newCostCenter, name: e.target.value})}
                />
                <input
                  className="px-3 py-2 border rounded"
                  placeholder="Code"
                  value={newCostCenter.code}
                  onChange={(e) => setNewCostCenter({...newCostCenter, code: e.target.value})}
                />
                <Button onClick={handleAddCostCenter}>
                  Add Cost Center
                </Button>
              </div>
              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Description"
                value={newCostCenter.description}
                onChange={(e) => setNewCostCenter({...newCostCenter, description: e.target.value})}
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Cost Centers</CardTitle>
            </CardHeader>
            <CardContent>
              {costCenters.length === 0 ? (
                <p className="text-gray-500">No cost centers created yet.</p>
              ) : (
                <div className="space-y-2">
                  {costCenters.map((cc) => (
                    <div key={cc.id} className="border p-3 rounded">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{cc.name}</h3>
                          <p className="text-sm text-gray-600">Code: {cc.code}</p>
                          {cc.description && (
                            <p className="text-sm text-gray-500">{cc.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}