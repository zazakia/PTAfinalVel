import React, { useState } from 'react';
import { Parent } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface ParentSelectorProps {
  parents: Parent[];
  selectedParent: Parent | null;
  onParentSelect: (parent: Parent) => void;
  onParentAdd: (parent: Parent) => void;
}

export const ParentSelector: React.FC<ParentSelectorProps> = ({
  parents,
  selectedParent,
  onParentSelect,
  onParentAdd
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newParent, setNewParent] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const handleAddParent = () => {
    if (newParent.firstName && newParent.lastName) {
      const parent: Parent = {
        id: Date.now().toString(),
        firstName: newParent.firstName,
        lastName: newParent.lastName,
        email: newParent.email,
        phone: newParent.phone
      };
      onParentAdd(parent);
      onParentSelect(parent);
      setNewParent({ firstName: '', lastName: '', email: '', phone: '' });
      setShowAddDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label htmlFor="parent-select">Select Parent</Label>
          <Select value={selectedParent?.id || ''} onValueChange={(value) => {
            const parent = parents.find(p => p.id === value);
            if (parent) onParentSelect(parent);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a parent" />
            </SelectTrigger>
            <SelectContent>
              {parents.map(parent => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.firstName} {parent.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="mt-6">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Parent</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input value={newParent.firstName} onChange={(e) => setNewParent({...newParent, firstName: e.target.value})} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input value={newParent.lastName} onChange={(e) => setNewParent({...newParent, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input value={newParent.email} onChange={(e) => setNewParent({...newParent, email: e.target.value})} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={newParent.phone} onChange={(e) => setNewParent({...newParent, phone: e.target.value})} />
              </div>
              <Button onClick={handleAddParent} className="w-full">Add Parent</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};