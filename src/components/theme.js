/**
 * Theme constants for UI components
 * Customize these values to match your brand
 */

export const COLORS = {
  // Primary colors
  primary: '#667eea',
  primaryDark: '#764ba2',
  
  // Secondary colors
  secondary: '#f093fb',
  secondaryDark: '#f5576c',
  
  // Status colors
  success: '#4caf50',
  successLight: '#66bb6a',
  warning: '#ff9800',
  warningLight: '#ffa726',
  error: '#f5576c',
  errorDark: '#e53e3e',
  info: '#2196f3',
  infoLight: '#42a5f5',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: '#999999',
  grayLight: '#f8f9fa',
  grayDark: '#333333',
  background: '#f5f7fa',
  
  // Transparent colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  glassmorphism: 'rgba(255, 255, 255, 0.9)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
};

export const GRADIENTS = {
  primary: [COLORS.primary, COLORS.primaryDark],
  secondary: [COLORS.secondary, COLORS.secondaryDark],
  success: [COLORS.success, COLORS.successLight],
  warning: [COLORS.warning, COLORS.warningLight],
  info: [COLORS.info, COLORS.infoLight],
  
  // Glass effects
  glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  glassLight: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'],
  
  // Custom gradients
  sunset: ['#ff6b6b', '#feca57'],
  ocean: ['#667eea', '#42a5f5'],
  forest: ['#4caf50', '#00bcd4'],
  royal: ['#764ba2', '#f093fb'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 25,
  round: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  colored: (color = '#667eea') => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }),
};

export const BUTTON_SIZES = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: FONT_SIZES.sm,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    fontSize: FONT_SIZES.base,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 36,
    fontSize: FONT_SIZES.lg,
  },
};

export default {
  COLORS,
  GRADIENTS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  BUTTON_SIZES,
};
