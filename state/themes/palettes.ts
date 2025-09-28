import { iGEMColors } from '../themeStore';

export const lightPalette = {
  mode: 'light' as const,
  primary: {
    main: iGEMColors.primary,
    dark: iGEMColors.primaryDark,
    light: '#4CAF50',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: iGEMColors.accent,
    dark: iGEMColors.accentDark,
    light: '#FFF176',
    contrastText: '#000000',
  },
  background: {
    default: iGEMColors.light.background,
    paper: iGEMColors.light.surface,
  },
  text: {
    primary: iGEMColors.light.text,
    secondary: iGEMColors.light.textSecondary,
  },
  divider: iGEMColors.light.border,
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: iGEMColors.light.border,
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: iGEMColors.light.textSecondary,
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const darkPalette = {
  mode: 'dark' as const,
  primary: {
    main: iGEMColors.primary,
    dark: iGEMColors.primaryDark,
    light: '#4CAF50',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: iGEMColors.accent,
    dark: iGEMColors.accentDark,
    light: '#FFF176',
    contrastText: '#000000',
  },
  background: {
    default: iGEMColors.dark.background,
    paper: iGEMColors.dark.surface,
  },
  text: {
    primary: iGEMColors.dark.text,
    secondary: iGEMColors.dark.textSecondary,
  },
  divider: iGEMColors.dark.border,
  grey: {
    50: '#1F2937',
    100: '#374151',
    200: '#4B5563',
    300: '#6B7280',
    400: '#9CA3AF',
    500: iGEMColors.dark.textSecondary,
    600: '#D1D5DB',
    700: '#E5E7EB',
    800: iGEMColors.dark.surface,
    900: iGEMColors.dark.background,
  },
};
