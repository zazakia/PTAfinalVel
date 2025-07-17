import { pgTable, uuid, varchar, text, integer, decimal, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Parents table
export const parents = pgTable('parents', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Students table
export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  parentId: uuid('parent_id').references(() => parents.id).notNull(),
  teacher: varchar('teacher', { length: 100 }),
  section: varchar('section', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Income Items table
export const incomeItems = pgTable('income_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'per_student' or 'per_parent'
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Income Transactions table
export const incomeTransactions = pgTable('income_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').references(() => parents.id).notNull(),
  studentIds: jsonb('student_ids').notNull(), // Array of student IDs
  items: jsonb('items').notNull(), // Array of income items
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'pending' or 'paid'
  receiptImage: text('receipt_image'),
  loggedUser: varchar('logged_user', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cost Centers table
export const costCenters = pgTable('cost_centers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Expense Transactions table
export const expenseTransactions = pgTable('expense_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  items: jsonb('items').notNull(), // Array of expense items
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  receiptImage: text('receipt_image'),
  loggedUser: varchar('logged_user', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Teachers table
export const teachers = pgTable('teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  subjects: jsonb('subjects'), // Array of subjects
  employeeId: varchar('employee_id', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sections table
export const sections = pgTable('sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  grade: varchar('grade', { length: 50 }).notNull(),
  capacity: integer('capacity').notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Roles table
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  permissions: jsonb('permissions').notNull(), // Array of permissions
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  roleId: uuid('role_id').references(() => roles.id).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const parentsRelations = relations(parents, ({ many }) => ({
  students: many(students),
  incomeTransactions: many(incomeTransactions),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  parent: one(parents, {
    fields: [students.parentId],
    references: [parents.id],
  }),
}));

export const teachersRelations = relations(teachers, ({ many }) => ({
  sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  teacher: one(teachers, {
    fields: [sections.teacherId],
    references: [teachers.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const incomeTransactionsRelations = relations(incomeTransactions, ({ one }) => ({
  parent: one(parents, {
    fields: [incomeTransactions.parentId],
    references: [parents.id],
  }),
}));