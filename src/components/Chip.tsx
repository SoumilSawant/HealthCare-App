import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { colors, layout, spacing } from '../theme/theme';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({ label, active = false, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.base, active && styles.active, style]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <Typography variant="captionSemibold" color={active ? colors.textInverse : colors.textPrimary}>
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: layout.borderRadius,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
