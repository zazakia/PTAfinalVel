import { eq, desc, and, or, like } from 'drizzle-orm';
import { db } from './connection';
import * as schema from './schema';
import type { 
  Parent, 
  Student, 
  IncomeItem, 
  IncomeTransaction, 
  ExpenseTransaction, 
  CostCenter, 
  Teacher, 
  Section, 
  User, 
  Role 
} from '@/types';

// Parents Services
export const parentsService = {
  async getAll(): Promise<Parent[]> {
    const result = await db.select().from(schema.parents).orderBy(desc(schema.parents.createdAt));
    return result.map(row => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email || undefined,
      phone: row.phone || undefined,
    }));
  },

  async create(parent: Omit<Parent, 'id'>): Promise<Parent> {
    const [result] = await db.insert(schema.parents).values({
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phone: parent.phone,
    }).returning();
    
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email || undefined,
      phone: result.phone || undefined,
    };
  },

  async update(id: string, parent: Partial<Parent>): Promise<Parent> {
    const [result] = await db.update(schema.parents)
      .set({
        firstName: parent.firstName,
        lastName: parent.lastName,
        email: parent.email,
        phone: parent.phone,
        updatedAt: new Date(),
      })
      .where(eq(schema.parents.id, id))
      .returning();

    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email || undefined,
      phone: result.phone || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await db.delete(schema.parents).where(eq(schema.parents.id, id));
  },

  async search(term: string): Promise<Parent[]> {
    const result = await db.select().from(schema.parents)
      .where(or(
        like(schema.parents.firstName, `%${term}%`),
        like(schema.parents.lastName, `%${term}%`),
        like(schema.parents.email, `%${term}%`)
      ));
    
    return result.map(row => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email || undefined,
      phone: row.phone || undefined,
    }));
  }
};

// Students Services
export const studentsService = {
  async getAll(): Promise<Student[]> {
    const result = await db.select().from(schema.students).orderBy(desc(schema.students.createdAt));
    return result.map(row => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      parentId: row.parentId,
      teacher: row.teacher || undefined,
      section: row.section || undefined,
    }));
  },

  async getByParentId(parentId: string): Promise<Student[]> {
    const result = await db.select().from(schema.students)
      .where(eq(schema.students.parentId, parentId));
    
    return result.map(row => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      parentId: row.parentId,
      teacher: row.teacher || undefined,
      section: row.section || undefined,
    }));
  },

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const [result] = await db.insert(schema.students).values({
      firstName: student.firstName,
      lastName: student.lastName,
      parentId: student.parentId,
      teacher: student.teacher,
      section: student.section,
    }).returning();
    
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      parentId: result.parentId,
      teacher: result.teacher || undefined,
      section: result.section || undefined,
    };
  },

  async update(id: string, student: Partial<Student>): Promise<Student> {
    const [result] = await db.update(schema.students)
      .set({
        firstName: student.firstName,
        lastName: student.lastName,
        parentId: student.parentId,
        teacher: student.teacher,
        section: student.section,
        updatedAt: new Date(),
      })
      .where(eq(schema.students.id, id))
      .returning();

    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      parentId: result.parentId,
      teacher: result.teacher || undefined,
      section: result.section || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await db.delete(schema.students).where(eq(schema.students.id, id));
  }
};

// Income Items Services
export const incomeItemsService = {
  async getAll(): Promise<IncomeItem[]> {
    const result = await db.select().from(schema.incomeItems).orderBy(desc(schema.incomeItems.createdAt));
    return result.map(row => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      type: row.type as 'per_student' | 'per_parent',
      description: row.description || undefined,
    }));
  },

  async create(item: Omit<IncomeItem, 'id'>): Promise<IncomeItem> {
    const [result] = await db.insert(schema.incomeItems).values({
      name: item.name,
      price: item.price.toString(),
      type: item.type,
      description: item.description,
    }).returning();
    
    return {
      id: result.id,
      name: result.name,
      price: parseFloat(result.price),
      type: result.type as 'per_student' | 'per_parent',
      description: result.description || undefined,
    };
  },

  async update(id: string, item: Partial<IncomeItem>): Promise<IncomeItem> {
    const [result] = await db.update(schema.incomeItems)
      .set({
        name: item.name,
        price: item.price?.toString(),
        type: item.type,
        description: item.description,
        updatedAt: new Date(),
      })
      .where(eq(schema.incomeItems.id, id))
      .returning();

    return {
      id: result.id,
      name: result.name,
      price: parseFloat(result.price),
      type: result.type as 'per_student' | 'per_parent',
      description: result.description || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await db.delete(schema.incomeItems).where(eq(schema.incomeItems.id, id));
  }
};

// Income Transactions Services
export const incomeTransactionsService = {
  async getAll(): Promise<IncomeTransaction[]> {
    const result = await db.select().from(schema.incomeTransactions).orderBy(desc(schema.incomeTransactions.createdAt));
    return result.map(row => ({
      id: row.id,
      parentId: row.parentId,
      studentIds: row.studentIds as string[],
      items: row.items as IncomeItem[],
      total: parseFloat(row.total),
      date: row.date,
      status: row.status as 'pending' | 'paid',
      receiptImage: row.receiptImage || undefined,
      loggedUser: row.loggedUser,
      createdAt: row.createdAt,
    }));
  },

  async create(transaction: Omit<IncomeTransaction, 'id' | 'createdAt'>): Promise<IncomeTransaction> {
    const [result] = await db.insert(schema.incomeTransactions).values({
      parentId: transaction.parentId,
      studentIds: transaction.studentIds,
      items: transaction.items,
      total: transaction.total.toString(),
      date: transaction.date,
      status: transaction.status,
      receiptImage: transaction.receiptImage,
      loggedUser: transaction.loggedUser,
    }).returning();
    
    return {
      id: result.id,
      parentId: result.parentId,
      studentIds: result.studentIds as string[],
      items: result.items as IncomeItem[],
      total: parseFloat(result.total),
      date: result.date,
      status: result.status as 'pending' | 'paid',
      receiptImage: result.receiptImage || undefined,
      loggedUser: result.loggedUser,
      createdAt: result.createdAt,
    };
  },

  async updateStatus(id: string, status: 'pending' | 'paid'): Promise<void> {
    await db.update(schema.incomeTransactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.incomeTransactions.id, id));
  }
};

// Teachers Services
export const teachersService = {
  async getAll(): Promise<Teacher[]> {
    const result = await db.select().from(schema.teachers).orderBy(desc(schema.teachers.createdAt));
    return result.map(row => ({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email || undefined,
      phone: row.phone || undefined,
      subjects: (row.subjects as string[]) || undefined,
      employeeId: row.employeeId || undefined,
    }));
  },

  async create(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
    const [result] = await db.insert(schema.teachers).values({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects,
      employeeId: teacher.employeeId,
    }).returning();
    
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email || undefined,
      phone: result.phone || undefined,
      subjects: (result.subjects as string[]) || undefined,
      employeeId: result.employeeId || undefined,
    };
  },

  async update(id: string, teacher: Partial<Teacher>): Promise<Teacher> {
    const [result] = await db.update(schema.teachers)
      .set({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phone: teacher.phone,
        subjects: teacher.subjects,
        employeeId: teacher.employeeId,
        updatedAt: new Date(),
      })
      .where(eq(schema.teachers.id, id))
      .returning();

    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email || undefined,
      phone: result.phone || undefined,
      subjects: (result.subjects as string[]) || undefined,
      employeeId: result.employeeId || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await db.delete(schema.teachers).where(eq(schema.teachers.id, id));
  }
};

// Sections Services
export const sectionsService = {
  async getAll(): Promise<Section[]> {
    const result = await db.select().from(schema.sections).orderBy(desc(schema.sections.createdAt));
    return result.map(row => ({
      id: row.id,
      name: row.name,
      grade: row.grade,
      capacity: row.capacity,
      teacherId: row.teacherId || undefined,
      description: row.description || undefined,
    }));
  },

  async create(section: Omit<Section, 'id'>): Promise<Section> {
    const [result] = await db.insert(schema.sections).values({
      name: section.name,
      grade: section.grade,
      capacity: section.capacity,
      teacherId: section.teacherId,
      description: section.description,
    }).returning();
    
    return {
      id: result.id,
      name: result.name,
      grade: result.grade,
      capacity: result.capacity,
      teacherId: result.teacherId || undefined,
      description: result.description || undefined,
    };
  },

  async update(id: string, section: Partial<Section>): Promise<Section> {
    const [result] = await db.update(schema.sections)
      .set({
        name: section.name,
        grade: section.grade,
        capacity: section.capacity,
        teacherId: section.teacherId,
        description: section.description,
        updatedAt: new Date(),
      })
      .where(eq(schema.sections.id, id))
      .returning();

    return {
      id: result.id,
      name: result.name,
      grade: result.grade,
      capacity: result.capacity,
      teacherId: result.teacherId || undefined,
      description: result.description || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await db.delete(schema.sections).where(eq(schema.sections.id, id));
  }
};

// Cost Centers Services
export const costCentersService = {
  async getAll(): Promise<CostCenter[]> {
    const result = await db.select().from(schema.costCenters).orderBy(desc(schema.costCenters.createdAt));
    return result.map(row => ({
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description || undefined,
    }));
  },

  async create(costCenter: Omit<CostCenter, 'id'>): Promise<CostCenter> {
    const [result] = await db.insert(schema.costCenters).values({
      name: costCenter.name,
      code: costCenter.code,
      description: costCenter.description,
    }).returning();
    
    return {
      id: result.id,
      name: result.name,
      code: result.code,
      description: result.description || undefined,
    };
  }
};

// Roles Services
export const rolesService = {
  async getAll(): Promise<Role[]> {
    const result = await db.select().from(schema.roles).orderBy(desc(schema.roles.createdAt));
    return result.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      permissions: row.permissions as string[],
      isActive: row.isActive,
      createdAt: row.createdAt,
    }));
  },

  async create(role: Omit<Role, 'id' | 'createdAt'>): Promise<Role> {
    const [result] = await db.insert(schema.roles).values({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
    }).returning();
    
    return {
      id: result.id,
      name: result.name,
      description: result.description || undefined,
      permissions: result.permissions as string[],
      isActive: result.isActive,
      createdAt: result.createdAt,
    };
  },

  async update(id: string, role: Partial<Role>): Promise<Role> {
    const [result] = await db.update(schema.roles)
      .set({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.roles.id, id))
      .returning();

    return {
      id: result.id,
      name: result.name,
      description: result.description || undefined,
      permissions: result.permissions as string[],
      isActive: result.isActive,
      createdAt: result.createdAt,
    };
  },

  async delete(id: string): Promise<void> {
    await db.delete(schema.roles).where(eq(schema.roles.id, id));
  }
};

// Users Services
export const usersService = {
  async getAll(): Promise<User[]> {
    const result = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
    return result.map(row => ({
      id: row.id,
      username: row.username,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      roleId: row.roleId,
      isActive: row.isActive,
      lastLogin: row.lastLogin || undefined,
      createdAt: row.createdAt,
    }));
  },

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const [result] = await db.insert(schema.users).values({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    }).returning();
    
    return {
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      roleId: result.roleId,
      isActive: result.isActive,
      lastLogin: result.lastLogin || undefined,
      createdAt: result.createdAt,
    };
  },

  async update(id: string, user: Partial<User>): Promise<User> {
    const [result] = await db.update(schema.users)
      .set({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning();

    return {
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      roleId: result.roleId,
      isActive: result.isActive,
      lastLogin: result.lastLogin || undefined,
      createdAt: result.createdAt,
    };
  },

  async delete(id: string): Promise<void> {
    await db.delete(schema.users).where(eq(schema.users.id, id));
  }
};