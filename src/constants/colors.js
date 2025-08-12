// Legacy colors - use theme system instead
export const COLORS = {
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

  // Background colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Button colors
  buttonPrimary: '#4A90E2',
  buttonSecondary: '#E0E0E0',
  buttonSuccess: '#4CAF50',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',

  // QR Scanner specific
  scannerOverlay: 'rgba(0, 0, 0, 0.3)',
  scannerCorner: '#4A90E2',
  scannerBackground: 'rgba(255, 255, 255, 0.9)',
};

// Theme-aware color getter (for backward compatibility)
export const getThemeColors = (theme) => ({
  primary: theme.primary,
  secondary: theme.secondary,
  accent: theme.accent,
  success: theme.success,
  warning: theme.warning,
  error: theme.error,
  textPrimary: theme.textPrimary,
  textSecondary: theme.textSecondary,
  textMuted: theme.textMuted,
  background: theme.background,
  surface: theme.surface,
  overlay: theme.overlay,
  buttonPrimary: theme.buttonPrimary,
  buttonSecondary: theme.buttonSecondary,
  buttonSuccess: theme.buttonSuccess,
  border: theme.border,
  borderLight: theme.borderLight,
  scannerOverlay: theme.scannerOverlay,
  scannerCorner: theme.scannerCorner,
  scannerBackground: theme.scannerBackground,
});