import React, { useState, useEffect } from 'react';
import { Student, Parent } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudentSelectorProps {
  students: Student[];
  selectedStudents: Student[];
  selectedParent: Parent | null;
  onStudentToggle: (student: Student) => void;
  onStudentAdd: (student: Student) => void;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudents,
  selectedParent,
  onStudentToggle,
  onStudentAdd
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', teacher: '', section: '' });
  const [lastAddedStudent, setLastAddedStudent] = useState<Student | null>(null);

  const availableStudents = selectedParent 
    ? students.filter(s => s.parentId === selectedParent.id)
    : students;

  const filteredStudents = availableStudents.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-select newly added student
  useEffect(() => {
    if (lastAddedStudent && !selectedStudents.some(s => s.id === lastAddedStudent.id)) {
      onStudentToggle(lastAddedStudent);
      setLastAddedStudent(null);
    }
  }, [lastAddedStudent, selectedStudents, onStudentToggle]);

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName && selectedParent) {
      const student: Student = {
        id: Date.now().toString(),
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        parentId: selectedParent.id,
        teacher: newStudent.teacher,
        section: newStudent.section
      };
      onStudentAdd(student);
      setLastAddedStudent(student);
      setNewStudent({ firstName: '', lastName: '', teacher: '', section: '' });
      setShowAddDialog(false);
    }
  };

  const removeStudent = (student: Student) => {
    onStudentToggle(student);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Select Students</Label>
        {selectedParent && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Student
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
        )}
      </div>
      
      {!selectedParent ? (
        <p className="text-muted-foreground">Please select a parent first</p>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {filteredStudents.map((student, index) => (
              <div key={student.id} className={`flex items-center space-x-2 p-2 rounded transition-colors ${index % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-blue-50'} border-blue-200 border`}>
                <Checkbox
                  checked={selectedStudents.some(s => s.id === student.id)}
                  onCheckedChange={() => onStudentToggle(student)}
                />
                <span>{student.firstName} {student.lastName}</span>
                {student.teacher && <span className="text-sm text-muted-foreground">({student.teacher})</span>}
              </div>
            ))}
            {filteredStudents.length === 0 && searchTerm && (
              <p className="text-muted-foreground text-sm">No students found matching "{searchTerm}"</p>
            )}
          </div>
        </div>
      )}
      
      {selectedStudents.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="bg-blue-100/50">
            <CardTitle className="text-sm text-blue-800">Selected Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedStudents.map((student, index) => (
                <div key={student.id} className={`flex items-center justify-between p-2 rounded ${index % 2 === 0 ? 'bg-blue-100' : 'bg-white'}`}>
                  <span>{student.firstName} {student.lastName}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeStudent(student)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};