import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// iGEM-inspired color palette, only for igem!!! ^^
export const iGEMColors = {
  primary: '#009B48', // iGEM Green
  primaryDark: '#007A3A',
  accent: '#FFD700', // Gold
  accentDark: '#FFC107',
  
  // Light theme
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Dark theme
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    shadow: 'rgba(0, 0, 0, 0.3)',
  }
};

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  getColors: () => typeof iGEMColors.light;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      getColors: () => {
        const state = get();
        return state.theme === 'light' ? iGEMColors.light : iGEMColors.dark;
      },
    }),
    { name: 'theme-store' }
  )
);
