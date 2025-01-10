export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "NONE";

export interface Task {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  category?: string;
  description: string;
  status: TaskStatus;
  attachments?: string[];
  completed: boolean;
}

export type ViewType = "list" | "board";
