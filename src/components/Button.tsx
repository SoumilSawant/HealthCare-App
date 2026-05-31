import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Typography } from './Typography';
import { colors, layout, spacing } from '../theme/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  style,
  disabled,
  ...props
}) => {
  const backgroundColor = disabled
    ? colors.border
    : variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
        ? colors.secondary
        : 'transparent';

  const textColor = disabled
    ? colors.textLight
    : variant === 'primary'
      ? colors.textInverse
      : colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor,
          width: fullWidth ? '100%' : 'auto',
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.85}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Typography variant="bodySemibold" color={textColor} align="center">
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...layout.shadowSubtle,
  },
});
