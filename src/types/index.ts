export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  parentId: string;
  teacher?: string;
  section?: string;
}

export interface IncomeItem {
  id: string;
  name: string;
  price: number;
  type: 'per_student' | 'per_parent';
  description?: string;
}

export interface IncomeTransaction {
  id: string;
  parentId: string;
  studentIds: string[];
  items: IncomeItem[];
  total: number;
  date: Date;
  status: 'pending' | 'paid';
  receiptImage?: string;
  loggedUser: string;
  createdAt: Date;
}

export interface CostCenter {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  costCenterId: string;
  description?: string;
}

export interface ExpenseTransaction {
  id: string;
  items: ExpenseItem[];
  total: number;
  date: Date;
  receiptImage?: string;
  loggedUser: string;
  createdAt: Date;
  description?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subjects?: string[];
  employeeId?: string;
}

export interface Section {
  id: string;
  name: string;
  grade: string;
  capacity: number;
  teacherId?: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
}