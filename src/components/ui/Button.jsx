import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { useThemedStyles, useTheme } from '../../hooks/useTheme';

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
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  
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

  const getLoadingColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
        return theme.textInverse;
      case 'outline':
        return theme.accent;
      default:
        return theme.textPrimary;
    }
  };

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
          color={getLoadingColor()} 
          size="small" 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme) => StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.borderRadius,
    paddingHorizontal: SPACING.lg,
    elevation: 2,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.buttonPrimary,
  },
  secondary: {
    backgroundColor: theme.buttonSecondary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  success: {
    backgroundColor: theme.buttonSuccess,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.accent,
  },
  
  // Sizes
  small: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  medium: {
    height: SPACING.buttonHeight || 48,
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
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  secondaryText: {
    color: theme.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  successText: {
    color: theme.textInverse,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  outlineText: {
    color: theme.accent,
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