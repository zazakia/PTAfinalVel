import React, { useState } from 'react';
import { IncomeItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ItemSelectorProps {
  availableItems: IncomeItem[];
  selectedItems: IncomeItem[];
  onItemAdd: (item: IncomeItem) => void;
  onItemRemove: (item: IncomeItem) => void;
  onNewItemCreate: (item: IncomeItem) => void;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({
  availableItems,
  selectedItems,
  onItemAdd,
  onItemRemove,
  onNewItemCreate
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', type: 'per_student' as 'per_student' | 'per_parent', description: '' });

  const handleCreateItem = () => {
    if (newItem.name && newItem.price) {
      const item: IncomeItem = {
        id: Date.now().toString(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        type: newItem.type,
        description: newItem.description
      };
      onNewItemCreate(item);
      onItemAdd(item);
      setNewItem({ name: '', price: '', type: 'per_student', description: '' });
      setShowAddDialog(false);
    }
  };

  const unselectedItems = availableItems.filter(item => 
    !selectedItems.some(selected => selected.id === item.id)
  );

  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Income Items</Label>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Create Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Income Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Item Name</Label>
                <Input value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={newItem.type} onValueChange={(value: 'per_student' | 'per_parent') => setNewItem({...newItem, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_student">Per Student</SelectItem>
                      <SelectItem value="per_parent">Per Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} />
              </div>
              <Button onClick={handleCreateItem} className="w-full">Create Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        {unselectedItems.map((item, index) => (
          <div key={item.id} className={`flex items-center justify-between p-2 border rounded cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-white hover:bg-emerald-50'} border-emerald-200`} onClick={() => onItemAdd(item)}>
            <div>
              <span className="font-medium">{item.name}</span>
              <Badge variant="secondary" className="ml-2">{item.type === 'per_student' ? 'Per Student' : 'Per Parent'}</Badge>
            </div>
            <span className="font-bold">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      {selectedItems.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader className="bg-emerald-100/50">
            <CardTitle className="text-sm flex justify-between text-emerald-800">
              <span>Selected Items</span>
              <span>Total: ${total.toFixed(2)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedItems.map((item, index) => (
                <div key={item.id} className={`flex items-center justify-between p-2 rounded ${index % 2 === 0 ? 'bg-emerald-100' : 'bg-white'}`}>
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{item.type === 'per_student' ? 'Per Student' : 'Per Parent'}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                    <Button variant="ghost" size="sm" onClick={() => onItemRemove(item)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};