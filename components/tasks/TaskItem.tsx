import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize, accents } from '../../lib/theme';
import { contrastText } from '../../lib/color';
import { Task } from '../../store/useTaskStore';
import { format } from 'date-fns';

const priorityColor: Record<Task['priority'], string> = {
  low: '#2FB88A',
  medium: '#E8B33D',
  high: '#E5566E',
};

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
};

export function TaskItem({ task, onToggle, onDelete, onPress }: TaskItemProps) {
  const { colors } = useTheme();

  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable
          onPress={onDelete}
          style={[styles.deleteAction, { backgroundColor: colors.danger }]}
        >
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </Pressable>
      )}
      overshootRight={false}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.row,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Pressable
          onPress={onToggle}
          hitSlop={10}
          style={styles.checkboxWrap}
          testID="task-checkbox"
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: task.completed ? accents.tasks : colors.border,
                backgroundColor: task.completed ? accents.tasks : 'transparent',
              },
            ]}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={14} color={contrastText(accents.tasks)} />
            )}
          </View>
        </Pressable>
        <View style={styles.textWrap}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.5 : 1,
              },
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <View
              style={[styles.priorityDot, { backgroundColor: priorityColor[task.priority] }]}
            />
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {task.category}
              {task.dueAt ? ` · ${format(new Date(task.dueAt), 'MMM d, h:mm a')}` : ''}
            </Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  checkboxWrap: {
    marginRight: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  meta: {
    fontSize: fontSize.xs,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
});
