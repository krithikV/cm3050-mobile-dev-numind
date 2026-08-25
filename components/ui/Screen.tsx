import React from 'react';
import { View, Text, StyleSheet, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize } from '../../lib/theme';

type ScreenProps = ScrollViewProps & {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  scroll?: boolean;
  children: React.ReactNode;
  // Rendered as a sibling of the scroll content, not inside it — so an
  // absolutely-positioned FAB stays pinned to the viewport instead of
  // scrolling away with the list.
  floatingAction?: React.ReactNode;
};

export function Screen({
  title,
  subtitle,
  headerRight,
  scroll = true,
  children,
  contentContainerStyle,
  floatingAction,
  ...rest
}: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const header = (title || headerRight) && (
    <View style={styles.headerRow}>
      <View style={{ flex: 1 }}>
        {title && (
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {headerRight}
    </View>
  );

  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? {
        contentContainerStyle: [
          styles.content,
          { paddingTop: insets.top + spacing.md },
          contentContainerStyle,
        ],
        showsVerticalScrollIndicator: false,
        ...rest,
      }
    : { style: [styles.content, { paddingTop: insets.top + spacing.md }] };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Container {...(containerProps as any)}>
        {header}
        {children}
      </Container>
      {floatingAction}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
