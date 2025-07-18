import React from 'react';
import { CalibrationSettings } from './CalibrationSettings';
import { SettingsSection } from './SettingsSection';
import { useThemeStore } from '../../state/themeStore';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col space-y-8">
      <h1 className="text-2xl font-bold text-cyan-400 mb-2">Settings</h1>
      <div className="bg-gray-800 p-4 rounded-xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-cyan-300">Theme</h2>
          <p className="text-gray-400 text-sm">Switch between dark and light mode.</p>
        </div>
        <button
          className={`px-4 py-2 rounded font-bold transition-colors duration-200 ${theme === 'dark' ? 'bg-cyan-700 text-white' : 'bg-gray-200 text-gray-900'}`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
      <CalibrationSettings />
      <SettingsSection
        title="Clear History"
        description="Permanently delete all analysis history from this device. This cannot be undone."
        actionLabel="Clear"
        actionDescription="Remove all analysis history from this device."
        onAction={() => {
          localStorage.removeItem('history-store');
          window.location.reload();
        }}
      />
      <div className="bg-gray-800 p-4 rounded-xl text-center mt-8">
        <h2 className="text-lg font-semibold text-cyan-300 mb-1">About</h2>
        <p className="text-gray-300 text-sm mb-2">Biosensor Analysis App</p>
        <p className="text-gray-400 text-xs">Version: <span className="font-mono">v2.3.7-beta</span></p>
        <p className="text-gray-400 text-xs">Build: 2024-07-14</p>
        <div className="mt-2">
          <a href="https://github.com/e-muzi/biosensor-apptesting" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-xs">Project GitHub</a>
        </div>
      </div>
    </div>
  );
};