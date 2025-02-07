export interface Task {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
    dueDate: Date | null;
    completedAt?: Date | null;
  }