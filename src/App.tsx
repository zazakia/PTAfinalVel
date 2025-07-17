import React, { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ResponsiveLayout } from '@/components/Layout/ResponsiveLayout';
import { MainMenu } from '@/components/Navigation/MainMenu';
import { IncomeFormMain } from '@/components/IncomeForm/IncomeFormMain';
import { IncomeHistoryMain } from '@/components/IncomeHistory/IncomeHistoryMain';
import { ReportsMain } from '@/components/Reports/ReportsMain';
import { KPIDashboard } from '@/components/KPI/KPIDashboard';
import ExpensesMain from '@/components/Expenses/ExpensesMain';
import { DataMain } from '@/components/Data/DataMain';
import { ParentsData } from '@/components/Data/ParentsData';
import { StudentsData } from '@/components/Data/StudentsData';
import { TeachersData } from '@/components/Data/TeachersData';
import { ItemsData } from '@/components/Data/ItemsData';
import { UsersData } from '@/components/Data/UsersData';
import { Student, Parent, IncomeItem, IncomeTransaction, ExpenseTransaction, CostCenter, Teacher, Section, User, Role } from '@/types';
import './App.css';

// Sample data
const sampleParents: Parent[] = [
  { id: '1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '123-456-7890' },
  { id: '2', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', phone: '098-765-4321' },
  { id: '3', firstName: 'Mike', lastName: 'Brown', email: 'mike@example.com', phone: '555-123-4567' }
];

const sampleStudents: Student[] = [
  { id: '1', firstName: 'Emma', lastName: 'Smith', parentId: '1', teacher: 'Mrs. Davis', section: 'A' },
  { id: '2', firstName: 'Liam', lastName: 'Smith', parentId: '1', teacher: 'Mr. Wilson', section: 'B' },
  { id: '3', firstName: 'Olivia', lastName: 'Johnson', parentId: '2', teacher: 'Mrs. Davis', section: 'A' },
  { id: '4', firstName: 'Noah', lastName: 'Brown', parentId: '3', teacher: 'Mr. Thompson', section: 'C' }
];

const sampleIncomeItems: IncomeItem[] = [
  { id: '1', name: 'Tuition Fee', price: 500, type: 'per_student' },
  { id: '2', name: 'Registration Fee', price: 100, type: 'per_parent' },
  { id: '3', name: 'Activity Fee', price: 50, type: 'per_student' },
  { id: '4', name: 'Transport Fee', price: 200, type: 'per_student' }
];

const sampleCostCenters: CostCenter[] = [
  { id: '1', name: 'Administration', code: 'ADM', description: 'Administrative expenses' },
  { id: '2', name: 'Facilities', code: 'FAC', description: 'Building and maintenance' },
  { id: '3', name: 'Education', code: 'EDU', description: 'Educational materials and supplies' },
  { id: '4', name: 'Technology', code: 'TECH', description: 'IT equipment and software' }
];

const sampleTeachers: Teacher[] = [
  { id: '1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@school.com', phone: '123-456-7890', subjects: ['Math', 'Science'], employeeId: 'EMP001' },
  { id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob@school.com', phone: '098-765-4321', subjects: ['English', 'History'], employeeId: 'EMP002' },
  { id: '3', firstName: 'Carol', lastName: 'Brown', email: 'carol@school.com', phone: '555-123-4567', subjects: ['Art', 'Music'], employeeId: 'EMP003' }
];

const sampleSections: Section[] = [
  { id: '1', name: 'Section A', grade: 'Grade 1', capacity: 30, teacherId: '1', description: 'Primary section for Grade 1' },
  { id: '2', name: 'Section B', grade: 'Grade 1', capacity: 25, teacherId: '2', description: 'Secondary section for Grade 1' },
  { id: '3', name: 'Section A', grade: 'Grade 2', capacity: 28, teacherId: '3', description: 'Primary section for Grade 2' }
];

const sampleRoles: Role[] = [
  { id: '1', name: 'Administrator', description: 'Full system access', permissions: ['read', 'write', 'delete', 'manage_users'], isActive: true, createdAt: new Date() },
  { id: '2', name: 'Teacher', description: 'Teacher access', permissions: ['read', 'write'], isActive: true, createdAt: new Date() },
  { id: '3', name: 'Staff', description: 'Staff access', permissions: ['read'], isActive: true, createdAt: new Date() }
];

const sampleUsers: User[] = [
  { id: '1', username: 'admin', email: 'admin@school.com', firstName: 'Admin', lastName: 'User', roleId: '1', isActive: true, createdAt: new Date() },
  { id: '2', username: 'teacher1', email: 'teacher1@school.com', firstName: 'John', lastName: 'Teacher', roleId: '2', isActive: true, createdAt: new Date() },
  { id: '3', username: 'staff1', email: 'staff1@school.com', firstName: 'Jane', lastName: 'Staff', roleId: '3', isActive: true, createdAt: new Date() }
];

function App() {
  const [currentPage, setCurrentPage] = useState('menu');
  const [parents, setParents] = useState<Parent[]>(sampleParents);
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>(sampleIncomeItems);
  const [incomeTransactions, setIncomeTransactions] = useState<IncomeTransaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseTransaction[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(sampleCostCenters);
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers);
  const [sections, setSections] = useState<Section[]>(sampleSections);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [roles, setRoles] = useState<Role[]>(sampleRoles);

  const handleParentAdd = (parent: Parent) => {
    setParents([...parents, parent]);
  };

  const handleStudentAdd = (student: Student) => {
    setStudents([...students, student]);
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleStudentDelete = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
  };

  const handleIncomeTransactionSave = (transaction: IncomeTransaction) => {
    setIncomeTransactions([...incomeTransactions, transaction]);
  };

  const handleExpenseTransactionSave = (transaction: ExpenseTransaction) => {
    setExpenseTransactions([...expenseTransactions, transaction]);
  };

  const handleCostCenterAdd = (costCenter: CostCenter) => {
    setCostCenters([...costCenters, costCenter]);
  };

  const handleParentUpdate = (updatedParent: Parent) => {
    setParents(parents.map(p => p.id === updatedParent.id ? updatedParent : p));
  };

  const handleParentDelete = (parentId: string) => {
    setParents(parents.filter(p => p.id !== parentId));
  };

  const handleIncomeItemAdd = (item: IncomeItem) => {
    setIncomeItems([...incomeItems, item]);
  };

  const handleIncomeItemUpdate = (updatedItem: IncomeItem) => {
    setIncomeItems(incomeItems.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const handleIncomeItemDelete = (itemId: string) => {
    setIncomeItems(incomeItems.filter(i => i.id !== itemId));
  };

  const handleTeacherAdd = (teacher: Teacher) => {
    setTeachers([...teachers, teacher]);
  };

  const handleTeacherUpdate = (updatedTeacher: Teacher) => {
    setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
  };

  const handleTeacherDelete = (teacherId: string) => {
    setTeachers(teachers.filter(t => t.id !== teacherId));
  };

  const handleSectionAdd = (section: Section) => {
    setSections([...sections, section]);
  };

  const handleSectionUpdate = (updatedSection: Section) => {
    setSections(sections.map(s => s.id === updatedSection.id ? updatedSection : s));
  };

  const handleSectionDelete = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const handleUserAdd = (user: User) => {
    setUsers([...users, user]);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleUserDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleRoleAdd = (role: Role) => {
    setRoles([...roles, role]);
  };

  const handleRoleUpdate = (updatedRole: Role) => {
    setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  const handleRoleDelete = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'income-form':
        return (
          <IncomeFormMain
            parents={parents}
            students={students}
            incomeItems={incomeItems}
            onParentAdd={handleParentAdd}
            onStudentAdd={handleStudentAdd}
            onTransactionSave={handleIncomeTransactionSave}
          />
        );
      case 'income-history':
        return (
          <IncomeHistoryMain
            transactions={incomeTransactions}
            parents={parents}
            students={students}
            incomeItems={incomeItems}
          />
        );
      case 'expenses':
        return (
          <ExpensesMain
            expenses={expenseTransactions}
            costCenters={costCenters}
            onSaveExpense={handleExpenseTransactionSave}
            onAddCostCenter={handleCostCenterAdd}
          />
        );
      case 'reports':
        return (
          <ReportsMain 
            incomeTransactions={incomeTransactions} 
            expenseTransactions={expenseTransactions}
            parents={parents}
            students={students}
          />
        );
      case 'kpi':
        return (
          <KPIDashboard 
            incomeTransactions={incomeTransactions}
            expenseTransactions={expenseTransactions}
            students={students} 
            parents={parents} 
          />
        );
      case 'data':
        return (
          <DataMain onNavigate={setCurrentPage} />
        );
      case 'data-parents':
        return (
          <ParentsData
            parents={parents}
            onParentAdd={handleParentAdd}
            onParentUpdate={handleParentUpdate}
            onParentDelete={handleParentDelete}
            onNavigate={setCurrentPage}
          />
        );
      case 'data-students':
        return (
          <StudentsData
            students={students}
            parents={parents}
            onStudentAdd={handleStudentAdd}
            onStudentUpdate={handleStudentUpdate}
            onStudentDelete={handleStudentDelete}
            onNavigate={setCurrentPage}
          />
        );
      case 'data-teachers':
        return (
          <TeachersData
            teachers={teachers}
            sections={sections}
            onTeacherAdd={handleTeacherAdd}
            onTeacherUpdate={handleTeacherUpdate}
            onTeacherDelete={handleTeacherDelete}
            onSectionAdd={handleSectionAdd}
            onSectionUpdate={handleSectionUpdate}
            onSectionDelete={handleSectionDelete}
            onNavigate={setCurrentPage}
          />
        );
      case 'data-items':
        return (
          <ItemsData
            items={incomeItems}
            onItemAdd={handleIncomeItemAdd}
            onItemUpdate={handleIncomeItemUpdate}
            onItemDelete={handleIncomeItemDelete}
            onNavigate={setCurrentPage}
          />
        );
      case 'data-users':
        return (
          <UsersData
            users={users}
            roles={roles}
            onUserAdd={handleUserAdd}
            onUserUpdate={handleUserUpdate}
            onUserDelete={handleUserDelete}
            onRoleAdd={handleRoleAdd}
            onRoleUpdate={handleRoleUpdate}
            onRoleDelete={handleRoleDelete}
            onNavigate={setCurrentPage}
          />
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Settings page coming soon...</p>
          </div>
        );
      default:
        return <MainMenu onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ResponsiveLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderCurrentPage()}
      </ResponsiveLayout>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;