import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { useMemo } from 'react';

export function useTheme() {
  return useThemeContext();
}

export function useThemedStyles(createStyles) {
  const { theme } = useTheme();
  
  return useMemo(() => {
    return createStyles(theme);
  }, [createStyles, theme]);
}

// Helper hooks for specific theme properties
export function useThemeColors() {
  const { theme } = useTheme();
  return theme;
}

export function useIsDarkMode() {
  const { isDarkMode } = useTheme();
  return isDarkMode;
}