import React, { useState } from 'react';
import { Parent, Student, IncomeItem, IncomeTransaction } from '@/types';
import { ParentSelector } from './ParentSelector';
import { StudentSelector } from './StudentSelector';
import { ItemSelector } from './ItemSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';

interface IncomeFormMainProps {
  parents: Parent[];
  students: Student[];
  incomeItems: IncomeItem[];
  onParentAdd: (parent: Parent) => void;
  onStudentAdd: (student: Student) => void;
  onTransactionSave: (transaction: IncomeTransaction) => void;
}

export const IncomeFormMain: React.FC<IncomeFormMainProps> = ({
  parents,
  students,
  incomeItems,
  onParentAdd,
  onStudentAdd,
  onTransactionSave
}) => {
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedItems, setSelectedItems] = useState<IncomeItem[]>([]);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const handleParentAdd = (parent: Parent) => {
    onParentAdd(parent);
    toast({ title: 'Parent added successfully!' });
  };

  const handleStudentToggle = (student: Student) => {
    setSelectedStudents(prev => {
      const exists = prev.find(s => s.id === student.id);
      if (exists) {
        return prev.filter(s => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleStudentAdd = (student: Student) => {
    onStudentAdd(student);
    toast({ title: 'Student added successfully!' });
  };

  const handleItemAdd = (item: IncomeItem) => {
    setSelectedItems(prev => [...prev, item]);
  };

  const handleItemRemove = (item: IncomeItem) => {
    setSelectedItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleNewItemCreate = (item: IncomeItem) => {
    toast({ title: 'New item created!' });
  };

  const handleImageUpload = (imageUrl: string) => {
    setReceiptImage(imageUrl);
  };

  const handleImageRemove = () => {
    setReceiptImage(null);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      if (item.type === 'per_student') {
        return total + (item.price * selectedStudents.length);
      } else {
        return total + item.price;
      }
    }, 0);
  };

  const handleSave = () => {
    if (!selectedParent || selectedStudents.length === 0 || selectedItems.length === 0) {
      toast({ title: 'Please complete all fields', variant: 'destructive' });
      return;
    }

    const transaction: IncomeTransaction = {
      id: Date.now().toString(),
      parentId: selectedParent.id,
      studentIds: selectedStudents.map(s => s.id),
      items: selectedItems,
      total: calculateTotal(),
      date: new Date(),
      status: 'pending',
      receiptImage: receiptImage || undefined,
      loggedUser: 'Current User',
      createdAt: new Date()
    };

    onTransactionSave(transaction);
    toast({ title: 'Income transaction saved successfully!' });
    
    // Reset form
    setSelectedParent(null);
    setSelectedStudents([]);
    setSelectedItems([]);
    setReceiptImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Income Entry Form
        </h1>
        <p className="text-muted-foreground mt-2">Manage parent and student income transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Parent Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <ParentSelector
              parents={parents}
              selectedParent={selectedParent}
              onParentSelect={setSelectedParent}
              onParentAdd={handleParentAdd}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Student Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentSelector
              students={students}
              selectedStudents={selectedStudents}
              selectedParent={selectedParent}
              onStudentToggle={handleStudentToggle}
              onStudentAdd={handleStudentAdd}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Income Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemSelector
              availableItems={incomeItems}
              selectedItems={selectedItems}
              onItemAdd={handleItemAdd}
              onItemRemove={handleItemRemove}
              onNewItemCreate={handleNewItemCreate}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            currentImage={receiptImage || undefined}
            label="Upload Receipt Image"
          />
        </CardContent>
      </Card>

      {(selectedParent || selectedStudents.length > 0 || selectedItems.length > 0) && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl flex justify-between items-center">
              <span>Transaction Summary</span>
              <span className="text-2xl font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Parent</h4>
                <p>{selectedParent ? `${selectedParent.firstName} ${selectedParent.lastName}` : 'Not selected'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Students ({selectedStudents.length})</h4>
                <div className="space-y-1">
                  {selectedStudents.map(student => (
                    <p key={student.id} className="text-sm">{student.firstName} {student.lastName}</p>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Items ({selectedItems.length})</h4>
                <div className="space-y-1">
                  {selectedItems.map(item => (
                    <p key={item.id} className="text-sm">{item.name} - ${item.price}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Time: {new Date().toLocaleTimeString()}</p>
              <p>Logged User: Current User</p>
            </div>
            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Save className="h-4 w-4 mr-2" />
              Save Transaction
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};