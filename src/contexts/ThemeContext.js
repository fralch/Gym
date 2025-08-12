import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const lightTheme = {
  primary: '#DC2626',
  secondary: '#FEE2E2',
  accent: '#EF4444',
  success: '#16A34A',
  warning: '#EA580C',
  error: '#DC2626',

  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#F9FAFB',

  // Background colors
  background: '#F3F4F6',
  backgroundSecondary: '#E5E7EB',
  surface: '#F9FAFB',
  surfaceVariant: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Button colors
  buttonPrimary: '#DC2626',
  buttonSecondary: '#D1D5DB',
  buttonSuccess: '#16A34A',
  buttonDanger: '#DC2626',

  // Border colors
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  borderDark: '#9CA3AF',

  // QR Scanner specific
  scannerOverlay: 'rgba(0, 0, 0, 0.3)',
  scannerCorner: '#DC2626',
  scannerBackground: 'rgba(249, 250, 251, 0.9)',

  // Modal and card colors
  modalBackground: '#F9FAFB',
  cardBackground: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',

  // Status bar
  statusBarStyle: 'dark-content',
  statusBarBackground: '#DC2626',
};

export const darkTheme = {
  primary: '#EF4444',
  secondary: '#7F1D1D',
  accent: '#F87171',
  success: '#22C55E',
  warning: '#F97316',
  error: '#EF4444',

  // Text colors
  textPrimary: '#F9FAFB',
  textSecondary: '#eee',
  textMuted: '#aaa',
  textInverse: '#111',

  // Background colors
  background: '#222',
  backgroundSecondary: '#333',
  surface: '#333',
  surfaceVariant: '#444',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Button colors
  buttonPrimary: '#EF4444',
  buttonSecondary: '#555',
  buttonSuccess: '#22C55E',
  buttonDanger: '#EF4444',

  // Border colors
  border: '#555',
  borderLight: '#555',
  borderDark: '#444',

  // QR Scanner specific
  scannerOverlay: 'rgba(0, 0, 0, 0.5)',
  scannerCorner: '#EF4444',
  scannerBackground: 'rgba(43, 43, 43, 0.9)',

  // Modal and card colors
  modalBackground: '#444',
  cardBackground: '#555',
  cardShadow: 'rgba(0, 0, 0, 0.3)',

  // Status bar
  statusBarStyle: 'light-content',
  statusBarBackground: '#EF4444',
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    loadThemePreference();
    
    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isSystemTheme) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });

    return () => subscription?.remove();
  }, [isSystemTheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      const savedSystemTheme = await AsyncStorage.getItem('system_theme');
      
      if (savedSystemTheme !== null) {
        const useSystemTheme = JSON.parse(savedSystemTheme);
        setIsSystemTheme(useSystemTheme);
        
        if (useSystemTheme) {
          const systemColorScheme = Appearance.getColorScheme();
          setIsDarkMode(systemColorScheme === 'dark');
        } else if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } else {
        // Default to system theme
        const systemColorScheme = Appearance.getColorScheme();
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
      // Fallback to system theme
      const systemColorScheme = Appearance.getColorScheme();
      setIsDarkMode(systemColorScheme === 'dark');
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    setIsSystemTheme(false);
    
    try {
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
      await AsyncStorage.setItem('system_theme', 'false');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const setSystemTheme = async () => {
    setIsSystemTheme(true);
    const systemColorScheme = Appearance.getColorScheme();
    setIsDarkMode(systemColorScheme === 'dark');
    
    try {
      await AsyncStorage.setItem('system_theme', 'true');
      await AsyncStorage.removeItem('theme_preference');
    } catch (error) {
      console.log('Error saving system theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    isSystemTheme,
    toggleTheme,
    setSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}