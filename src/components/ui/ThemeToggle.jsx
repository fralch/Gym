import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../../hooks/useTheme';
import { SPACING, TYPOGRAPHY } from '../../constants';

export default function ThemeToggle({ showLabel = true, size = 'medium' }) {
  const { theme, isDarkMode, toggleTheme, isSystemTheme } = useTheme();
  const styles = useThemedStyles(createStyles);
  
  const getIconSize = () => {
    switch (size) {
      case 'small': return 18;
      case 'large': return 28;
      default: return 24;
    }
  };

  const getThemeIcon = () => {
    if (isSystemTheme) return 'auto-awesome';
    return isDarkMode ? 'light-mode' : 'dark-mode';
  };

  const getThemeLabel = () => {
    if (isSystemTheme) return 'Automático';
    return isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, size === 'small' && styles.smallContainer]} 
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={getThemeIcon()}
          size={getIconSize()}
          color={theme.primary}
        />
      </View>
      
      {showLabel && (
        <Text style={[styles.label, size === 'small' && styles.smallLabel]}>
          {getThemeLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.borderRadius,
    borderWidth: 1,
    borderColor: theme.border,
  },

  smallContainer: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },

  iconContainer: {
    marginRight: SPACING.xs,
  },

  label: {
    color: theme.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  smallLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});