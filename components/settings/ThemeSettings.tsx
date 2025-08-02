import React from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';

export const ThemeSettings: React.FC = () => {
  const { theme, toggleTheme, getColors } = useThemeStore();
  const colors = getColors();
  
  return (
    <section>
      <h2 
        className="text-xl font-bold mb-2"
        style={{ color: colors.text }}
      >
        General
      </h2>
      <div 
        className="p-4 rounded-xl flex items-center justify-between"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}
      >
        <div>
          <h3 
            className="text-lg font-semibold mb-1"
            style={{ color: iGEMColors.primary }}
          >
            Theme
          </h3>
          <p 
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            Switch between dark and light mode for your comfort.
          </p>
        </div>
        <button
          className="px-4 py-2 rounded font-bold transition-colors duration-200"
          style={{
            backgroundColor: theme === 'dark' ? iGEMColors.primary : colors.background,
            color: theme === 'dark' ? 'white' : colors.text,
            border: theme === 'light' ? `1px solid ${colors.border}` : 'none'
          }}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </section>
  );
}; 