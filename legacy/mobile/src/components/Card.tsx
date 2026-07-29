import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, layout, spacing } from '../theme/theme';

interface CardProps extends ViewProps {
  onPress?: () => void;
  variant?: 'elevated' | 'outline' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  onPress,
  variant = 'elevated',
  style,
  children,
  ...props
}) => {
  const Component = onPress ? TouchableOpacity : View;

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return layout.shadowSubtle;
      case 'outline':
        return {
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'flat':
      default:
        return {};
    }
  };

  return (
    <Component
      style={[
        styles.container,
        getVariantStyles(),
        style,
      ]}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      {...props as any}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
  },
});
