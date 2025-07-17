import React, { useState, useEffect } from 'react';
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
// Database services will be imported conditionally to avoid browser errors
let dbServices: any = null;

// Only import database services in server environment
const loadDbServices = async () => {
  if (typeof window === 'undefined') {
    // Server-side - safe to import
    const services = await import('@/lib/db/services');
    return services;
  } else {
    // Client-side - return null, will use localStorage fallback
    return null;
  }
};
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
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [incomeTransactions, setIncomeTransactions] = useState<IncomeTransaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseTransaction[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Load data from localStorage and potentially database
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load from localStorage first
        const storedParents = localStorage.getItem('parents');
        const storedStudents = localStorage.getItem('students');
        const storedIncomeItems = localStorage.getItem('incomeItems');
        const storedIncomeTransactions = localStorage.getItem('incomeTransactions');
        const storedCostCenters = localStorage.getItem('costCenters');
        const storedTeachers = localStorage.getItem('teachers');
        const storedSections = localStorage.getItem('sections');
        const storedUsers = localStorage.getItem('users');
        const storedRoles = localStorage.getItem('roles');

        if (storedParents) {
          setParents(JSON.parse(storedParents));
        } else {
          setParents(sampleParents);
          localStorage.setItem('parents', JSON.stringify(sampleParents));
        }

        if (storedStudents) {
          setStudents(JSON.parse(storedStudents));
        } else {
          setStudents(sampleStudents);
          localStorage.setItem('students', JSON.stringify(sampleStudents));
        }

        if (storedIncomeItems) {
          setIncomeItems(JSON.parse(storedIncomeItems));
        } else {
          setIncomeItems(sampleIncomeItems);
          localStorage.setItem('incomeItems', JSON.stringify(sampleIncomeItems));
        }

        if (storedIncomeTransactions) {
          setIncomeTransactions(JSON.parse(storedIncomeTransactions));
        }

        if (storedCostCenters) {
          setCostCenters(JSON.parse(storedCostCenters));
        } else {
          setCostCenters(sampleCostCenters);
          localStorage.setItem('costCenters', JSON.stringify(sampleCostCenters));
        }

        if (storedTeachers) {
          setTeachers(JSON.parse(storedTeachers));
        } else {
          setTeachers(sampleTeachers);
          localStorage.setItem('teachers', JSON.stringify(sampleTeachers));
        }

        if (storedSections) {
          setSections(JSON.parse(storedSections));
        } else {
          setSections(sampleSections);
          localStorage.setItem('sections', JSON.stringify(sampleSections));
        }

        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          setUsers(sampleUsers);
          localStorage.setItem('users', JSON.stringify(sampleUsers));
        }

        if (storedRoles) {
          setRoles(JSON.parse(storedRoles));
        } else {
          setRoles(sampleRoles);
          localStorage.setItem('roles', JSON.stringify(sampleRoles));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data if everything fails
        setParents(sampleParents);
        setStudents(sampleStudents);
        setIncomeItems(sampleIncomeItems);
        setCostCenters(sampleCostCenters);
        setTeachers(sampleTeachers);
        setSections(sampleSections);
        setUsers(sampleUsers);
        setRoles(sampleRoles);
      }
    };

    loadData();
  }, []);

  const handleParentAdd = (parent: Parent) => {
    const newParent = { ...parent, id: Date.now().toString() };
    const updatedParents = [...parents, newParent];
    setParents(updatedParents);
    localStorage.setItem('parents', JSON.stringify(updatedParents));
  };

  const handleStudentAdd = (student: Student) => {
    const newStudent = { ...student, id: Date.now().toString() };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
    const updatedStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const handleStudentDelete = (studentId: string) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const handleIncomeTransactionSave = (transaction: IncomeTransaction) => {
    const newTransaction = { ...transaction, id: Date.now().toString(), createdAt: new Date() };
    const updatedTransactions = [...incomeTransactions, newTransaction];
    setIncomeTransactions(updatedTransactions);
    localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
  };

  const handleExpenseTransactionSave = (transaction: ExpenseTransaction) => {
    const newTransaction = { ...transaction, id: Date.now().toString(), createdAt: new Date() };
    const updatedTransactions = [...expenseTransactions, newTransaction];
    setExpenseTransactions(updatedTransactions);
    localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
  };

  const handleCostCenterAdd = (costCenter: CostCenter) => {
    const newCostCenter = { ...costCenter, id: Date.now().toString() };
    const updatedCostCenters = [...costCenters, newCostCenter];
    setCostCenters(updatedCostCenters);
    localStorage.setItem('costCenters', JSON.stringify(updatedCostCenters));
  };

  const handleParentUpdate = (updatedParent: Parent) => {
    const updatedParents = parents.map(p => p.id === updatedParent.id ? updatedParent : p);
    setParents(updatedParents);
    localStorage.setItem('parents', JSON.stringify(updatedParents));
  };

  const handleParentDelete = (parentId: string) => {
    const updatedParents = parents.filter(p => p.id !== parentId);
    setParents(updatedParents);
    localStorage.setItem('parents', JSON.stringify(updatedParents));
  };

  const handleIncomeItemAdd = (item: IncomeItem) => {
    const newItem = { ...item, id: Date.now().toString() };
    const updatedItems = [...incomeItems, newItem];
    setIncomeItems(updatedItems);
    localStorage.setItem('incomeItems', JSON.stringify(updatedItems));
  };

  const handleIncomeItemUpdate = (updatedItem: IncomeItem) => {
    const updatedItems = incomeItems.map(i => i.id === updatedItem.id ? updatedItem : i);
    setIncomeItems(updatedItems);
    localStorage.setItem('incomeItems', JSON.stringify(updatedItems));
  };

  const handleIncomeItemDelete = (itemId: string) => {
    const updatedItems = incomeItems.filter(i => i.id !== itemId);
    setIncomeItems(updatedItems);
    localStorage.setItem('incomeItems', JSON.stringify(updatedItems));
  };

  const handleTeacherAdd = (teacher: Teacher) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    const updatedTeachers = [...teachers, newTeacher];
    setTeachers(updatedTeachers);
    localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
  };

  const handleTeacherUpdate = (updatedTeacher: Teacher) => {
    const updatedTeachers = teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t);
    setTeachers(updatedTeachers);
    localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
  };

  const handleTeacherDelete = (teacherId: string) => {
    const updatedTeachers = teachers.filter(t => t.id !== teacherId);
    setTeachers(updatedTeachers);
    localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
  };

  const handleSectionAdd = (section: Section) => {
    const newSection = { ...section, id: Date.now().toString() };
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    localStorage.setItem('sections', JSON.stringify(updatedSections));
  };

  const handleSectionUpdate = (updatedSection: Section) => {
    const updatedSections = sections.map(s => s.id === updatedSection.id ? updatedSection : s);
    setSections(updatedSections);
    localStorage.setItem('sections', JSON.stringify(updatedSections));
  };

  const handleSectionDelete = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    setSections(updatedSections);
    localStorage.setItem('sections', JSON.stringify(updatedSections));
  };

  const handleUserAdd = (user: User) => {
    const newUser = { ...user, id: Date.now().toString(), createdAt: new Date() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleUserUpdate = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleUserDelete = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleRoleAdd = (role: Role) => {
    const newRole = { ...role, id: Date.now().toString(), createdAt: new Date() };
    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
  };

  const handleRoleUpdate = (updatedRole: Role) => {
    const updatedRoles = roles.map(r => r.id === updatedRole.id ? updatedRole : r);
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
  };

  const handleRoleDelete = (roleId: string) => {
    const updatedRoles = roles.filter(r => r.id !== roleId);
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
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