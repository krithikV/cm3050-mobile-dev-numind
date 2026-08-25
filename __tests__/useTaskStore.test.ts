import { useTaskStore, filterTasks, tasksDueToday, Task } from '../store/useTaskStore';

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  it('adds a task with defaults', () => {
    const task = useTaskStore.getState().addTask({
      title: 'Write report',
      category: 'Work',
      priority: 'high',
      dueAt: null,
    });
    expect(task.completed).toBe(false);
    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].title).toBe('Write report');
  });

  it('toggles completion', () => {
    const task = useTaskStore.getState().addTask({
      title: 'Buy milk',
      category: 'Errands',
      priority: 'low',
      dueAt: null,
    });
    useTaskStore.getState().toggleTask(task.id);
    expect(useTaskStore.getState().tasks[0].completed).toBe(true);
    useTaskStore.getState().toggleTask(task.id);
    expect(useTaskStore.getState().tasks[0].completed).toBe(false);
  });

  it('deletes a task', () => {
    const task = useTaskStore.getState().addTask({
      title: 'Temp',
      category: 'Personal',
      priority: 'medium',
      dueAt: null,
    });
    useTaskStore.getState().deleteTask(task.id);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it('updates a task', () => {
    const task = useTaskStore.getState().addTask({
      title: 'Old title',
      category: 'Personal',
      priority: 'medium',
      dueAt: null,
    });
    useTaskStore.getState().updateTask(task.id, { title: 'New title' });
    expect(useTaskStore.getState().tasks[0].title).toBe('New title');
  });

  it('filters tasks by active/done', () => {
    const tasks: Task[] = [
      { id: '1', title: 'A', category: 'x', priority: 'low', dueAt: null, completed: false, createdAt: '' },
      { id: '2', title: 'B', category: 'x', priority: 'low', dueAt: null, completed: true, createdAt: '' },
    ];
    expect(filterTasks(tasks, 'active')).toHaveLength(1);
    expect(filterTasks(tasks, 'done')).toHaveLength(1);
    expect(filterTasks(tasks, 'all')).toHaveLength(2);
  });

  it('finds tasks due today, excluding completed ones', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks: Task[] = [
      { id: '1', title: 'Due today', category: 'x', priority: 'low', dueAt: today.toISOString(), completed: false, createdAt: '' },
      { id: '2', title: 'Due today but done', category: 'x', priority: 'low', dueAt: today.toISOString(), completed: true, createdAt: '' },
      { id: '3', title: 'Due tomorrow', category: 'x', priority: 'low', dueAt: tomorrow.toISOString(), completed: false, createdAt: '' },
      { id: '4', title: 'No due date', category: 'x', priority: 'low', dueAt: null, completed: false, createdAt: '' },
    ];
    expect(tasksDueToday(tasks)).toHaveLength(1);
    expect(tasksDueToday(tasks)[0].id).toBe('1');
  });
});
