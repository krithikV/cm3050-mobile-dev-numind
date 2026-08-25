import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../lib/storage';
import { newId } from '../lib/id';

export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  dueAt: string | null; // ISO string
  completed: boolean;
  createdAt: string;
};

type TaskState = {
  tasks: Task[];
  addTask: (input: Omit<Task, 'id' | 'completed' | 'createdAt'>) => Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (input) => {
        const task: Task = {
          ...input,
          id: newId(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set({ tasks: [task, ...get().tasks] });
        return task;
      },
      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }),
      deleteTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),
      updateTask: (id, updates) =>
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }),
    }),
    {
      name: storageKeys.tasks,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function filterTasks(tasks: Task[], filter: 'all' | 'active' | 'done') {
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'done') return tasks.filter((t) => t.completed);
  return tasks;
}

export function tasksDueToday(tasks: Task[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tasks.filter((t) => {
    if (t.completed || !t.dueAt) return false;
    const due = new Date(t.dueAt);
    return due >= today && due < tomorrow;
  });
}
