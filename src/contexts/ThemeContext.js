import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const lightTheme = {
  primary: '#4A90E2',
  secondary: '#E3F2FD',
  accent: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textMuted: '#BDBDBD',
  textInverse: '#FFFFFF',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Button colors
  buttonPrimary: '#4A90E2',
  buttonSecondary: '#E0E0E0',
  buttonSuccess: '#4CAF50',
  buttonDanger: '#F44336',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#BDBDBD',

  // QR Scanner specific
  scannerOverlay: 'rgba(0, 0, 0, 0.3)',
  scannerCorner: '#4A90E2',
  scannerBackground: 'rgba(255, 255, 255, 0.9)',

  // Modal and card colors
  modalBackground: '#FFFFFF',
  cardBackground: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',

  // Status bar
  statusBarStyle: 'dark-content',
  statusBarBackground: '#4A90E2',
};

export const darkTheme = {
  primary: '#BB86FC',
  secondary: '#3700B3',
  accent: '#03DAC6',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#CF6679',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#757575',
  textInverse: '#000000',

  // Background colors
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Button colors
  buttonPrimary: '#BB86FC',
  buttonSecondary: '#333333',
  buttonSuccess: '#4CAF50',
  buttonDanger: '#CF6679',

  // Border colors
  border: '#333333',
  borderLight: '#404040',
  borderDark: '#666666',

  // QR Scanner specific
  scannerOverlay: 'rgba(0, 0, 0, 0.5)',
  scannerCorner: '#BB86FC',
  scannerBackground: 'rgba(18, 18, 18, 0.9)',

  // Modal and card colors
  modalBackground: '#1E1E1E',
  cardBackground: '#2C2C2C',
  cardShadow: 'rgba(0, 0, 0, 0.3)',

  // Status bar
  statusBarStyle: 'light-content',
  statusBarBackground: '#BB86FC',
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