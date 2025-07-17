import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Plus, Trash2 } from 'lucide-react';
import { ExpenseItem, ExpenseTransaction, CostCenter } from '@/types';

interface ExpenseFormMainProps {
  costCenters: CostCenter[];
  onSave: (transaction: ExpenseTransaction) => void;
}

export default function ExpenseFormMain({ costCenters, onSave }: ExpenseFormMainProps) {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [description, setDescription] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const addItem = () => {
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      costCenterId: '',
      description: ''
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof ExpenseItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleImageUpload = (imageUrl: string) => {
    setReceiptImage(imageUrl);
  };

  const handleImageRemove = () => {
    setReceiptImage(null);
  };

  const handleSubmit = () => {
    if (items.length === 0) return;
    
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const transaction: ExpenseTransaction = {
      id: Date.now().toString(),
      items,
      total,
      date: new Date(),
      receiptImage: receiptImage || undefined,
      loggedUser: 'Current User',
      createdAt: new Date(),
      description
    };
    
    onSave(transaction);
    setItems([]);
    setDescription('');
    setReceiptImage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expense description"
          />
        </div>

        <div>
          <ImageUpload
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            currentImage={receiptImage || undefined}
            label="Upload Receipt Image"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Expense Items</Label>
            <Button type="button" onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          {items.map((item) => (
            <div key={item.id} className="border p-3 rounded mb-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                />
                <Select onValueChange={(value) => updateItem(item.id, 'costCenterId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cost Center" />
                  </SelectTrigger>
                  <SelectContent>
                    {costCenters.map(cc => (
                      <SelectItem key={cc.id} value={cc.id}>
                        {cc.name} ({cc.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-lg font-semibold">
            Total: ${items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
          </div>
          <Button onClick={handleSubmit} disabled={items.length === 0}>
            Save Expense
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}