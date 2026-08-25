import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle, StyleProp, Text } from 'react-native';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize } from '../../lib/theme';

type InputProps = TextInputProps & {
  label?: string;
  // Layout styles (flex, width, margin) belong on the wrapper View, not the
  // inner TextInput — `style` only reaches the TextInput.
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, style, containerStyle, ...rest }: InputProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceAlt,
            color: colors.text,
            borderColor: colors.border,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: fontSize.md,
  },
});
