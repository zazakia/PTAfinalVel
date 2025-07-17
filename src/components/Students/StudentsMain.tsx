import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Student, Parent } from '@/types';

interface StudentsMainProps {
  students: Student[];
  parents: Parent[];
  onStudentAdd: (student: Student) => void;
  onStudentUpdate: (student: Student) => void;
  onStudentDelete: (studentId: string) => void;
}

export const StudentsMain: React.FC<StudentsMainProps> = ({
  students,
  parents,
  onStudentAdd,
  onStudentUpdate,
  onStudentDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    parentId: '',
    teacher: '',
    section: ''
  });

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const parent = parents.find(p => p.id === student.parentId);
    const parentName = parent ? `${parent.firstName} ${parent.lastName}`.toLowerCase() : '';
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           parentName.includes(searchTerm.toLowerCase()) ||
           (student.teacher?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
           (student.section?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  });

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName && newStudent.parentId) {
      const student: Student = {
        id: Date.now().toString(),
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        parentId: newStudent.parentId,
        teacher: newStudent.teacher,
        section: newStudent.section
      };
      onStudentAdd(student);
      setNewStudent({ firstName: '', lastName: '', parentId: '', teacher: '', section: '' });
      setShowAddDialog(false);
    }
  };

  const handleEditStudent = () => {
    if (editingStudent && newStudent.firstName && newStudent.lastName && newStudent.parentId) {
      const updatedStudent: Student = {
        ...editingStudent,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        parentId: newStudent.parentId,
        teacher: newStudent.teacher,
        section: newStudent.section
      };
      onStudentUpdate(updatedStudent);
      setEditingStudent(null);
      setNewStudent({ firstName: '', lastName: '', parentId: '', teacher: '', section: '' });
    }
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      firstName: student.firstName,
      lastName: student.lastName,
      parentId: student.parentId,
      teacher: student.teacher || '',
      section: student.section || ''
    });
  };

  const getParentName = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId);
    return parent ? `${parent.firstName} ${parent.lastName}` : 'Unknown Parent';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Students Management</h2>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input value={newStudent.firstName} onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input value={newStudent.lastName} onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Parent</Label>
                <Select value={newStudent.parentId} onValueChange={(value) => setNewStudent({...newStudent, parentId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent" />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Teacher</Label>
                  <Input value={newStudent.teacher} onChange={(e) => setNewStudent({...newStudent, teacher: e.target.value})} />
                </div>
                <div>
                  <Label>Section</Label>
                  <Input value={newStudent.section} onChange={(e) => setNewStudent({...newStudent, section: e.target.value})} />
                </div>
              </div>
              <Button onClick={handleAddStudent} className="w-full">Add Student</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name, parent, teacher, or section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {student.firstName} {student.lastName}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onStudentDelete(student.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{getParentName(student.parentId)}</span>
                </div>
                {student.teacher && (
                  <Badge variant="outline">Teacher: {student.teacher}</Badge>
                )}
                {student.section && (
                  <Badge variant="secondary">Section: {student.section}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No students found</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input value={newStudent.firstName} onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={newStudent.lastName} onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Parent</Label>
              <Select value={newStudent.parentId} onValueChange={(value) => setNewStudent({...newStudent, parentId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Teacher</Label>
                <Input value={newStudent.teacher} onChange={(e) => setNewStudent({...newStudent, teacher: e.target.value})} />
              </div>
              <div>
                <Label>Section</Label>
                <Input value={newStudent.section} onChange={(e) => setNewStudent({...newStudent, section: e.target.value})} />
              </div>
            </div>
            <Button onClick={handleEditStudent} className="w-full">Update Student</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};