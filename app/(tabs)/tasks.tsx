import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { EmptyState } from '../../components/ui/EmptyState';
import { FAB } from '../../components/ui/FAB';
import { TaskItem } from '../../components/tasks/TaskItem';
import { TaskForm } from '../../components/tasks/TaskForm';
import { useTaskStore, filterTasks, Task, Priority } from '../../store/useTaskStore';
import { accents, spacing } from '../../lib/theme';

type Filter = 'all' | 'active' | 'done';

export default function TasksScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [filter, setFilter] = useState<Filter>('active');
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);

  const handleSubmit = (input: {
    title: string;
    category: string;
    priority: Priority;
    dueAt: string | null;
  }) => {
    if (editing) {
      updateTask(editing.id, input);
    } else {
      addTask(input);
    }
    setEditing(null);
  };

  return (
    <Screen
      title="Tasks"
      subtitle={`${tasks.filter((t) => !t.completed).length} remaining`}
      floatingAction={
        <FAB
          color={accents.tasks}
          onPress={() => {
            setEditing(null);
            setFormVisible(true);
          }}
        />
      }
    >
      <SegmentedControl
        segments={[
          { label: 'Active', value: 'active' },
          { label: 'All', value: 'all' },
          { label: 'Done', value: 'done' },
        ]}
        value={filter}
        onChange={(v) => setFilter(v as Filter)}
        accentColor={accents.tasks}
      />
      <View style={{ height: spacing.md }} />

      {visibleTasks.length === 0 ? (
        <EmptyState
          icon="checkmark-done-circle-outline"
          title="Nothing here"
          subtitle="Tap the + button to add your first task."
          accentColor={accents.tasks}
        />
      ) : (
        <View>
          {visibleTasks.map((item) => (
            <TaskItem
              key={item.id}
              task={item}
              onToggle={() => toggleTask(item.id)}
              onDelete={() => deleteTask(item.id)}
              onPress={() => {
                setEditing(item);
                setFormVisible(true);
              }}
            />
          ))}
        </View>
      )}

      <TaskForm
        key={editing?.id ?? 'new'}
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </Screen>
  );
}
