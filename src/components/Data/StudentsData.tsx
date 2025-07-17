import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Student, Parent } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface StudentsDataProps {
  students: Student[];
  parents: Parent[];
  onStudentAdd: (student: Student) => void;
  onStudentUpdate: (student: Student) => void;
  onStudentDelete: (studentId: string) => void;
  onNavigate: (page: string) => void;
}

export const StudentsData: React.FC<StudentsDataProps> = ({
  students,
  parents,
  onStudentAdd,
  onStudentUpdate,
  onStudentDelete,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    parentId: '',
    teacher: '',
    section: ''
  });

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getParentName = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId);
    return parent ? `${parent.firstName} ${parent.lastName}` : 'Unknown Parent';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.parentId) {
      toast({
        title: "Error",
        description: "First name, last name, and parent are required",
        variant: "destructive"
      });
      return;
    }

    if (editingStudent) {
      const updatedStudent = { ...editingStudent, ...formData } as Student;
      onStudentUpdate(updatedStudent);
      toast({
        title: "Success",
        description: "Student updated successfully"
      });
      setEditingStudent(null);
    } else {
      const newStudent: Student = {
        id: uuidv4(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        parentId: formData.parentId || '',
        teacher: formData.teacher,
        section: formData.section
      };
      onStudentAdd(newStudent);
      toast({
        title: "Success",
        description: "Student added successfully"
      });
      setIsAddDialogOpen(false);
    }

    setFormData({
      firstName: '',
      lastName: '',
      parentId: '',
      teacher: '',
      section: ''
    });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      onStudentDelete(studentId);
      toast({
        title: "Success",
        description: "Student deleted successfully"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      parentId: '',
      teacher: '',
      section: ''
    });
    setEditingStudent(null);
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
        <h1 className="text-2xl lg:text-3xl font-bold">Students Management</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Manage student records and information
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="bg-blue-100/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-blue-800">Students List ({filteredStudents.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[200px]"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
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
                      <Label htmlFor="parentId">Parent/Guardian *</Label>
                      <Select value={formData.parentId} onValueChange={(value) => setFormData({...formData, parentId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent/guardian" />
                        </SelectTrigger>
                        <SelectContent>
                          {parents.map((parent) => (
                            <SelectItem key={parent.id} value={parent.id}>
                              {parent.firstName} {parent.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="teacher">Teacher</Label>
                      <Input
                        id="teacher"
                        value={formData.teacher || ''}
                        onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        value={formData.section || ''}
                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Student</Button>
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
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student.id} className={index % 2 === 0 ? "bg-blue-25" : "bg-white hover:bg-blue-50"}>
                    <TableCell>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                    </TableCell>
                    <TableCell>{getParentName(student.parentId)}</TableCell>
                    <TableCell>{student.teacher || '-'}</TableCell>
                    <TableCell>
                      {student.section ? (
                        <Badge variant="secondary">{student.section}</Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
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

      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
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
              <Label htmlFor="editParentId">Parent/Guardian *</Label>
              <Select value={formData.parentId} onValueChange={(value) => setFormData({...formData, parentId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent/guardian" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.firstName} {parent.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editTeacher">Teacher</Label>
              <Input
                id="editTeacher"
                value={formData.teacher || ''}
                onChange={(e) => setFormData({...formData, teacher: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editSection">Section</Label>
              <Input
                id="editSection"
                value={formData.section || ''}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Student</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};