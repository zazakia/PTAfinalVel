import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Parent } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ParentsDataProps {
  parents: Parent[];
  onParentAdd: (parent: Parent) => void;
  onParentUpdate: (parent: Parent) => void;
  onParentDelete: (parentId: string) => void;
  onNavigate: (page: string) => void;
}

export const ParentsData: React.FC<ParentsDataProps> = ({
  parents,
  onParentAdd,
  onParentUpdate,
  onParentDelete,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState<Partial<Parent>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const filteredParents = parents.filter(parent =>
    parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }

    if (editingParent) {
      const updatedParent = { ...editingParent, ...formData } as Parent;
      onParentUpdate(updatedParent);
      toast({
        title: "Success",
        description: "Parent updated successfully"
      });
      setEditingParent(null);
    } else {
      const newParent: Parent = {
        id: uuidv4(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email,
        phone: formData.phone
      };
      onParentAdd(newParent);
      toast({
        title: "Success",
        description: "Parent added successfully"
      });
      setIsAddDialogOpen(false);
    }

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
  };

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent);
    setFormData(parent);
  };

  const handleDelete = (parentId: string) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      onParentDelete(parentId);
      toast({
        title: "Success",
        description: "Parent deleted successfully"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    setEditingParent(null);
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
        <h1 className="text-2xl lg:text-3xl font-bold">Parents/Guardians Management</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Manage parent and guardian information
        </p>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <CardHeader className="bg-purple-100/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-purple-800">Parents List ({filteredParents.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[200px]"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Parent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Parent</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName || ''}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName || ''}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Parent</Button>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent, index) => (
                  <TableRow key={parent.id} className={index % 2 === 0 ? "bg-purple-25" : "bg-white hover:bg-purple-50"}>
                    <TableCell>
                      <div className="font-medium">
                        {parent.firstName} {parent.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{parent.email || '-'}</TableCell>
                    <TableCell>{parent.phone || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(parent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(parent.id)}
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

      <Dialog open={!!editingParent} onOpenChange={() => setEditingParent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Parent</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editFirstName">First Name *</Label>
                <Input
                  id="editFirstName"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Last Name *</Label>
                <Input
                  id="editLastName"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editPhone">Phone</Label>
              <Input
                id="editPhone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingParent(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Parent</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};