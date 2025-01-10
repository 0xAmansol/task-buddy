import { create } from "zustand";
import { Task } from "../types/task";
import {
  getAllTasks,
  updateTask,
  addTask,
  deleteTask,
  getTaskHistory,
} from "../utils/firestore";

interface TaskState {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  fetchTaskHistory: (taskId: string) => Promise<string[]>; // Add this line
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  fetchTasks: async () => {
    const tasks = (await getAllTasks()) as Task[];
    set({ tasks });
  },
  updateTask: (task: Task) => {
    updateTask(task);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  },
  addTask: (task: Task) => {
    addTask(task);
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },
  removeTask: (taskId: string) => {
    deleteTask(taskId);
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },
  fetchTaskHistory: async (taskId: string) => {
    const history = await getTaskHistory(taskId);
    return history;
  },
}));
