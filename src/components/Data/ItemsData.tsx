import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { IncomeItem } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ItemsDataProps {
  items: IncomeItem[];
  onItemAdd: (item: IncomeItem) => void;
  onItemUpdate: (item: IncomeItem) => void;
  onItemDelete: (itemId: string) => void;
  onNavigate: (page: string) => void;
}

export const ItemsData: React.FC<ItemsDataProps> = ({
  items,
  onItemAdd,
  onItemUpdate,
  onItemDelete,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomeItem | null>(null);
  const [formData, setFormData] = useState<Partial<IncomeItem>>({
    name: '',
    price: 0,
    type: 'per_student',
    description: ''
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Item name and valid price are required",
        variant: "destructive"
      });
      return;
    }

    if (editingItem) {
      const updatedItem = { ...editingItem, ...formData } as IncomeItem;
      onItemUpdate(updatedItem);
      toast({
        title: "Success",
        description: "Item updated successfully"
      });
      setEditingItem(null);
    } else {
      const newItem: IncomeItem = {
        id: uuidv4(),
        name: formData.name || '',
        price: formData.price || 0,
        type: formData.type || 'per_student',
        description: formData.description
      };
      onItemAdd(newItem);
      toast({
        title: "Success",
        description: "Item added successfully"
      });
      setIsAddDialogOpen(false);
    }

    setFormData({
      name: '',
      price: 0,
      type: 'per_student',
      description: ''
    });
  };

  const handleEdit = (item: IncomeItem) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onItemDelete(itemId);
      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      type: 'per_student',
      description: ''
    });
    setEditingItem(null);
  };

  const getTypeLabel = (type: string) => {
    return type === 'per_student' ? 'Per Student' : 'Per Parent';
  };

  const getTypeColor = (type: string) => {
    return type === 'per_student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('data')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Data
          </Button>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold">Items Management</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Manage fee items and pricing
        </p>
      </div>

      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader className="bg-emerald-100/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-emerald-800">Items List ({filteredItems.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[200px]"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Item Name *</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Pricing Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'per_student' | 'per_parent'})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="per_student">Per Student</SelectItem>
                          <SelectItem value="per_parent">Per Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Item</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={item.id} className={index % 2 === 0 ? "bg-emerald-25" : "bg-white hover:bg-emerald-50"}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono">${item.price.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeLabel(item.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {item.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editName">Item Name *</Label>
              <Input
                id="editName"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="editPrice">Price *</Label>
              <Input
                id="editPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || 0}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <Label htmlFor="editType">Pricing Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as 'per_student' | 'per_parent'})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_student">Per Student</SelectItem>
                  <SelectItem value="per_parent">Per Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};