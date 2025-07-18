import React from 'react';
import { useThemeStore } from '../../state/themeStore';

export const ThemeSettings: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <section>
      <h2 className="text-xl font-bold text-cyan-400 mb-2">General</h2>
      <div className="bg-gray-800 p-4 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-cyan-300">Theme</h3>
          <p className="text-gray-400 text-sm">Switch between dark and light mode for your comfort.</p>
        </div>
        <button
          className={`px-4 py-2 rounded font-bold transition-colors duration-200 ${theme === 'dark' ? 'bg-cyan-700 text-white' : 'bg-gray-200 text-gray-900'}`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </section>
  );
}; 