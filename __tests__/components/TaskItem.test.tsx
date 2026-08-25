import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../testUtils';
import { TaskItem } from '../../components/tasks/TaskItem';
import { Task } from '../../store/useTaskStore';

const baseTask: Task = {
  id: '1',
  title: 'Buy milk',
  category: 'Errands',
  priority: 'low',
  dueAt: null,
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('TaskItem', () => {
  it('renders the task title and category', () => {
    renderWithTheme(
      <TaskItem task={baseTask} onToggle={() => {}} onDelete={() => {}} onPress={() => {}} />
    );
    expect(screen.getByText('Buy milk')).toBeTruthy();
    expect(screen.getByText('Errands')).toBeTruthy();
  });

  it('shows a strikethrough style when completed', () => {
    renderWithTheme(
      <TaskItem
        task={{ ...baseTask, completed: true }}
        onToggle={() => {}}
        onDelete={() => {}}
        onPress={() => {}}
      />
    );
    const title = screen.getByText('Buy milk');
    const flatStyle = [title.props.style].flat();
    expect(flatStyle.some((s) => s?.textDecorationLine === 'line-through')).toBe(true);
  });

  it('calls onPress when the row is tapped', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <TaskItem task={baseTask} onToggle={() => {}} onDelete={() => {}} onPress={onPress} />
    );
    fireEvent.press(screen.getByText('Buy milk'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle when the checkbox is tapped, not onPress', () => {
    const onToggle = jest.fn();
    const onPress = jest.fn();
    renderWithTheme(
      <TaskItem task={baseTask} onToggle={onToggle} onDelete={() => {}} onPress={onPress} />
    );
    fireEvent.press(screen.getByTestId('task-checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('includes the due date in the meta text when set', () => {
    renderWithTheme(
      <TaskItem
        task={{ ...baseTask, dueAt: '2026-03-10T15:00:00.000Z' }}
        onToggle={() => {}}
        onDelete={() => {}}
        onPress={() => {}}
      />
    );
    expect(screen.getByText(/Errands ·/)).toBeTruthy();
  });
});
