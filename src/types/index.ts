export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}