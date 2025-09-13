import { createTheme, ThemeOptions } from '@mui/material/styles';
import { iGEMColors } from './themeStore';

// Create light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
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
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
    shadows: [
    'none',
    `0 1px 3px ${iGEMColors.light.shadow}`,
    `0 2px 4px ${iGEMColors.light.shadow}`,
    `0 4px 8px ${iGEMColors.light.shadow}`,
    `0 8px 16px ${iGEMColors.light.shadow}`,
    `0 16px 32px ${iGEMColors.light.shadow}`,
    `0 32px 64px ${iGEMColors.light.shadow}`,
    `0 64px 128px ${iGEMColors.light.shadow}`,
    `0 128px 256px ${iGEMColors.light.shadow}`,
    `0 256px 512px ${iGEMColors.light.shadow}`,
    `0 512px 1024px ${iGEMColors.light.shadow}`,
    `0 1024px 2048px ${iGEMColors.light.shadow}`,
    `0 2048px 4096px ${iGEMColors.light.shadow}`,
    `0 4096px 8192px ${iGEMColors.light.shadow}`,
    `0 8192px 16384px ${iGEMColors.light.shadow}`,
    `0 16384px 32768px ${iGEMColors.light.shadow}`,
    `0 32768px 65536px ${iGEMColors.light.shadow}`,
    `0 65536px 131072px ${iGEMColors.light.shadow}`,
    `0 131072px 262144px ${iGEMColors.light.shadow}`,
    `0 262144px 524288px ${iGEMColors.light.shadow}`,
    `0 524288px 1048576px ${iGEMColors.light.shadow}`,
    `0 1048576px 2097152px ${iGEMColors.light.shadow}`,
    `0 2097152px 4194304px ${iGEMColors.light.shadow}`,
    `0 4194304px 8388608px ${iGEMColors.light.shadow}`,
    `0 8388608px 16777216px ${iGEMColors.light.shadow}`,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: `0 2px 4px \${iGEMColors.light.shadow}`,
          '&:hover': {
            boxShadow: `0 4px 8px \${iGEMColors.light.shadow}`,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: `0 2px 4px \${iGEMColors.light.shadow}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: `0 2px 4px \${iGEMColors.light.shadow}`,
        },
      },
    },
  },
} as ThemeOptions);

// Create dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: iGEMColors.dark.textSecondary,
      600: '#4B5563',
      700: '#374151',
      800: iGEMColors.dark.surface,
      900: iGEMColors.dark.background,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
    shadows: [
    'none',
    `0 1px 3px ${iGEMColors.dark.shadow}`,
    `0 2px 4px ${iGEMColors.dark.shadow}`,
    `0 4px 8px ${iGEMColors.dark.shadow}`,
    `0 8px 16px ${iGEMColors.dark.shadow}`,
    `0 16px 32px ${iGEMColors.dark.shadow}`,
    `0 32px 64px ${iGEMColors.dark.shadow}`,
    `0 64px 128px ${iGEMColors.dark.shadow}`,
    `0 128px 256px ${iGEMColors.dark.shadow}`,
    `0 256px 512px ${iGEMColors.dark.shadow}`,
    `0 512px 1024px ${iGEMColors.dark.shadow}`,
    `0 1024px 2048px ${iGEMColors.dark.shadow}`,
    `0 2048px 4096px ${iGEMColors.dark.shadow}`,
    `0 4096px 8192px ${iGEMColors.dark.shadow}`,
    `0 8192px 16384px ${iGEMColors.dark.shadow}`,
    `0 16384px 32768px ${iGEMColors.dark.shadow}`,
    `0 32768px 65536px ${iGEMColors.dark.shadow}`,
    `0 65536px 131072px ${iGEMColors.dark.shadow}`,
    `0 131072px 262144px ${iGEMColors.dark.shadow}`,
    `0 262144px 524288px ${iGEMColors.dark.shadow}`,
    `0 524288px 1048576px ${iGEMColors.dark.shadow}`,
    `0 1048576px 2097152px ${iGEMColors.dark.shadow}`,
    `0 2097152px 4194304px ${iGEMColors.dark.shadow}`,
    `0 4194304px 8388608px ${iGEMColors.dark.shadow}`,
    `0 8388608px 16777216px ${iGEMColors.dark.shadow}`,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: `0 2px 4px \${iGEMColors.dark.shadow}`,
          '&:hover': {
            boxShadow: `0 4px 8px \${iGEMColors.dark.shadow}`,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: `0 2px 4px \${iGEMColors.dark.shadow}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: `0 2px 4px \${iGEMColors.dark.shadow}`,
        },
      },
    },
  },
} as ThemeOptions);

// Theme selector function
export const getMuiTheme = (theme: 'light' | 'dark') => {
  return theme === 'light' ? lightTheme : darkTheme;
};
