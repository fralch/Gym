import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? COLORS.textPrimary : COLORS.accent} 
          size="small" 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.borderRadius,
    paddingHorizontal: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.buttonPrimary,
  },
  secondary: {
    backgroundColor: COLORS.buttonSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  success: {
    backgroundColor: COLORS.buttonSuccess,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  
  // Sizes
  small: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  medium: {
    height: SPACING.buttonHeight,
  },
  large: {
    height: 56,
    paddingHorizontal: SPACING.xl,
  },
  
  // States
  disabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  
  // Text styles
  text: {
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  secondaryText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  successText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  outlineText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  smallText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  largeText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
  },
  disabledText: {
    opacity: 0.7,
  },
});