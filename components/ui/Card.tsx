import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, shadow } from '../../lib/theme';

type CardProps = ViewProps & {
  padded?: boolean;
};

export function Card({ style, padded = true, children, ...rest }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: padded ? spacing.md : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    ...shadow.card,
  },
});
