import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Typography } from './Typography';
import { colors, layout, spacing } from '../theme/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost';
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
  const getBackgroundColor = () => {
    if (disabled) return colors.lineSoft;
    switch (variant) {
      case 'primary': return colors.sage;
      case 'secondary': return colors.gold;
      case 'outline': return colors.surface;
      case 'ghost': return colors.surface;
      case 'text': return 'transparent';
      default: return colors.sage;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.inkFaint;
    switch (variant) {
      case 'primary': return '#fff';
      case 'secondary': return '#fff';
      case 'outline': return colors.sageDeep;
      case 'ghost': return colors.sageDeep;
      case 'text': return colors.sage;
      default: return '#fff';
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.line;
    if (variant === 'outline') return colors.sageDeep;
    if (variant === 'ghost') return colors.line;
    return 'transparent';
  };

  const getBorderWidth = () => {
    if (variant === 'outline' || variant === 'ghost') return 1.5;
    return 0;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          width: fullWidth ? '100%' : 'auto',
          borderColor: getBorderColor(),
          borderWidth: getBorderWidth(),
        },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Typography variant="bodySemibold" color={getTextColor()} align="center">
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
    marginVertical: spacing.s,
  },
});
