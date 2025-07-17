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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Search, ArrowLeft, UserCheck, BookOpen } from 'lucide-react';
import { Teacher, Section } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface TeachersDataProps {
  teachers: Teacher[];
  sections: Section[];
  onTeacherAdd: (teacher: Teacher) => void;
  onTeacherUpdate: (teacher: Teacher) => void;
  onTeacherDelete: (teacherId: string) => void;
  onSectionAdd: (section: Section) => void;
  onSectionUpdate: (section: Section) => void;
  onSectionDelete: (sectionId: string) => void;
  onNavigate: (page: string) => void;
}

export const TeachersData: React.FC<TeachersDataProps> = ({
  teachers,
  sections,
  onTeacherAdd,
  onTeacherUpdate,
  onTeacherDelete,
  onSectionAdd,
  onSectionUpdate,
  onSectionDelete,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  
  const [teacherFormData, setTeacherFormData] = useState<Partial<Teacher>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subjects: [],
    employeeId: ''
  });

  const [sectionFormData, setSectionFormData] = useState<Partial<Section>>({
    name: '',
    grade: '',
    capacity: 0,
    teacherId: '',
    description: ''
  });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned';
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teacherFormData.firstName || !teacherFormData.lastName) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }

    if (editingTeacher) {
      const updatedTeacher = { ...editingTeacher, ...teacherFormData } as Teacher;
      onTeacherUpdate(updatedTeacher);
      toast({
        title: "Success",
        description: "Teacher updated successfully"
      });
      setEditingTeacher(null);
    } else {
      const newTeacher: Teacher = {
        id: uuidv4(),
        firstName: teacherFormData.firstName || '',
        lastName: teacherFormData.lastName || '',
        email: teacherFormData.email,
        phone: teacherFormData.phone,
        subjects: teacherFormData.subjects || [],
        employeeId: teacherFormData.employeeId
      };
      onTeacherAdd(newTeacher);
      toast({
        title: "Success",
        description: "Teacher added successfully"
      });
      setIsAddTeacherDialogOpen(false);
    }

    resetTeacherForm();
  };

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sectionFormData.name || !sectionFormData.grade) {
      toast({
        title: "Error",
        description: "Section name and grade are required",
        variant: "destructive"
      });
      return;
    }

    if (editingSection) {
      const updatedSection = { ...editingSection, ...sectionFormData } as Section;
      onSectionUpdate(updatedSection);
      toast({
        title: "Success",
        description: "Section updated successfully"
      });
      setEditingSection(null);
    } else {
      const newSection: Section = {
        id: uuidv4(),
        name: sectionFormData.name || '',
        grade: sectionFormData.grade || '',
        capacity: sectionFormData.capacity || 0,
        teacherId: sectionFormData.teacherId || undefined,
        description: sectionFormData.description
      };
      onSectionAdd(newSection);
      toast({
        title: "Success",
        description: "Section added successfully"
      });
      setIsAddSectionDialogOpen(false);
    }

    resetSectionForm();
  };

  const resetTeacherForm = () => {
    setTeacherFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subjects: [],
      employeeId: ''
    });
    setEditingTeacher(null);
  };

  const resetSectionForm = () => {
    setSectionFormData({
      name: '',
      grade: '',
      capacity: 0,
      teacherId: '',
      description: ''
    });
    setEditingSection(null);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setTeacherFormData(teacher);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setSectionFormData(section);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      onTeacherDelete(teacherId);
      toast({
        title: "Success",
        description: "Teacher deleted successfully"
      });
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      onSectionDelete(sectionId);
      toast({
        title: "Success",
        description: "Section deleted successfully"
      });
    }
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
        <h1 className="text-2xl lg:text-3xl font-bold">Teachers & Sections Management</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Manage teachers and class sections
        </p>
      </div>

      <Tabs defaultValue="teachers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teachers">
            <UserCheck className="h-4 w-4 mr-2" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="sections">
            <BookOpen className="h-4 w-4 mr-2" />
            Sections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader className="bg-amber-100/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-amber-800">Teachers List ({filteredTeachers.length})</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search teachers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-[200px]"
                    />
                  </div>
                  <Dialog open={isAddTeacherDialogOpen} onOpenChange={setIsAddTeacherDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetTeacherForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Teacher</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleTeacherSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={teacherFormData.firstName || ''}
                              onChange={(e) => setTeacherFormData({...teacherFormData, firstName: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={teacherFormData.lastName || ''}
                              onChange={(e) => setTeacherFormData({...teacherFormData, lastName: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={teacherFormData.email || ''}
                            onChange={(e) => setTeacherFormData({...teacherFormData, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={teacherFormData.phone || ''}
                            onChange={(e) => setTeacherFormData({...teacherFormData, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="employeeId">Employee ID</Label>
                          <Input
                            id="employeeId"
                            value={teacherFormData.employeeId || ''}
                            onChange={(e) => setTeacherFormData({...teacherFormData, employeeId: e.target.value})}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddTeacherDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Teacher</Button>
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
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div className="font-medium">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.email || '-'}</TableCell>
                        <TableCell>{teacher.phone || '-'}</TableCell>
                        <TableCell>{teacher.employeeId || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTeacher(teacher)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTeacher(teacher.id)}
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
        </TabsContent>

        <TabsContent value="sections">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader className="bg-orange-100/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-orange-800">Sections List ({filteredSections.length})</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-[200px]"
                    />
                  </div>
                  <Dialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetSectionForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Section</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSectionSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="sectionName">Section Name *</Label>
                          <Input
                            id="sectionName"
                            value={sectionFormData.name || ''}
                            onChange={(e) => setSectionFormData({...sectionFormData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="grade">Grade *</Label>
                          <Input
                            id="grade"
                            value={sectionFormData.grade || ''}
                            onChange={(e) => setSectionFormData({...sectionFormData, grade: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={sectionFormData.capacity || 0}
                            onChange={(e) => setSectionFormData({...sectionFormData, capacity: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="teacherId">Assigned Teacher</Label>
                          <Select value={sectionFormData.teacherId || ''} onValueChange={(value) => setSectionFormData({...sectionFormData, teacherId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Unassigned</SelectItem>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.firstName} {teacher.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={sectionFormData.description || ''}
                            onChange={(e) => setSectionFormData({...sectionFormData, description: e.target.value})}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddSectionDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Section</Button>
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
                      <TableHead>Section</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell>
                          <div className="font-medium">{section.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{section.grade}</Badge>
                        </TableCell>
                        <TableCell>{section.capacity}</TableCell>
                        <TableCell>{section.teacherId ? getTeacherName(section.teacherId) : 'Unassigned'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSection(section)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSection(section.id)}
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
        </TabsContent>
      </Tabs>

      {/* Edit Teacher Dialog */}
      <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editFirstName">First Name *</Label>
                <Input
                  id="editFirstName"
                  value={teacherFormData.firstName || ''}
                  onChange={(e) => setTeacherFormData({...teacherFormData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Last Name *</Label>
                <Input
                  id="editLastName"
                  value={teacherFormData.lastName || ''}
                  onChange={(e) => setTeacherFormData({...teacherFormData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={teacherFormData.email || ''}
                onChange={(e) => setTeacherFormData({...teacherFormData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editPhone">Phone</Label>
              <Input
                id="editPhone"
                value={teacherFormData.phone || ''}
                onChange={(e) => setTeacherFormData({...teacherFormData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editEmployeeId">Employee ID</Label>
              <Input
                id="editEmployeeId"
                value={teacherFormData.employeeId || ''}
                onChange={(e) => setTeacherFormData({...teacherFormData, employeeId: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingTeacher(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Teacher</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSectionSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editSectionName">Section Name *</Label>
              <Input
                id="editSectionName"
                value={sectionFormData.name || ''}
                onChange={(e) => setSectionFormData({...sectionFormData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="editGrade">Grade *</Label>
              <Input
                id="editGrade"
                value={sectionFormData.grade || ''}
                onChange={(e) => setSectionFormData({...sectionFormData, grade: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="editCapacity">Capacity</Label>
              <Input
                id="editCapacity"
                type="number"
                value={sectionFormData.capacity || 0}
                onChange={(e) => setSectionFormData({...sectionFormData, capacity: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="editTeacherId">Assigned Teacher</Label>
              <Select value={sectionFormData.teacherId || ''} onValueChange={(value) => setSectionFormData({...sectionFormData, teacherId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={sectionFormData.description || ''}
                onChange={(e) => setSectionFormData({...sectionFormData, description: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button type="submit">Update Section</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};