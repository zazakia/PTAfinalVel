import { useState, useEffect } from 'react';
import { Parent, Student, IncomeItem, IncomeTransaction } from '@/types';

const STORAGE_KEYS = {
  PARENTS: 'income_parents',
  STUDENTS: 'income_students',
  ITEMS: 'income_items',
  TRANSACTIONS: 'income_transactions'
};

// Sample data
const sampleParents: Parent[] = [
  { id: '1', firstName: 'John', lastName: 'Smith', email: 'john@email.com', phone: '555-0101' },
  { id: '2', firstName: 'Mary', lastName: 'Johnson', email: 'mary@email.com', phone: '555-0102' }
];

const sampleStudents: Student[] = [
  { id: '1', firstName: 'Emma', lastName: 'Smith', parentId: '1', teacher: 'Ms. Davis', section: 'A' },
  { id: '2', firstName: 'Liam', lastName: 'Smith', parentId: '1', teacher: 'Mr. Wilson', section: 'B' },
  { id: '3', firstName: 'Olivia', lastName: 'Johnson', parentId: '2', teacher: 'Ms. Davis', section: 'A' }
];

export const useIncomeData = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  const [transactions, setTransactions] = useState<IncomeTransaction[]>([]);

  useEffect(() => {
    // Load data from localStorage or use sample data
    const loadedParents = JSON.parse(localStorage.getItem(STORAGE_KEYS.PARENTS) || 'null') || sampleParents;
    const loadedStudents = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || 'null') || sampleStudents;
    const loadedItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
    const loadedTransactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');

    setParents(loadedParents);
    setStudents(loadedStudents);
    setIncomeItems(loadedItems);
    setTransactions(loadedTransactions);

    // Save sample data to localStorage if not exists
    if (!localStorage.getItem(STORAGE_KEYS.PARENTS)) {
      localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(loadedParents));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(loadedStudents));
    }
  }, []);

  const saveParent = (parent: Parent) => {
    const updated = [...parents.filter(p => p.id !== parent.id), parent];
    setParents(updated);
    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(updated));
  };

  const saveStudent = (student: Student) => {
    const updated = [...students.filter(s => s.id !== student.id), student];
    setStudents(updated);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
  };

  const saveTransaction = (transaction: IncomeTransaction) => {
    const updated = [...transactions, transaction];
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  };

  return {
    parents,
    students,
    incomeItems,
    transactions,
    saveParent,
    saveStudent,
    saveTransaction
  };
};