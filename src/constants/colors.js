// Legacy colors - use theme system instead
export const COLORS = {
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

  // Background colors
  background: '#F3F4F6',
  surface: '#F9FAFB',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Button colors
  buttonPrimary: '#DC2626',
  buttonSecondary: '#D1D5DB',
  buttonSuccess: '#16A34A',

  // Border colors
  border: '#D1D5DB',
  borderLight: '#E5E7EB',

  // QR Scanner specific
  scannerOverlay: 'rgba(0, 0, 0, 0.3)',
  scannerCorner: '#DC2626',
  scannerBackground: 'rgba(249, 250, 251, 0.9)',
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