import React from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: 'analyze' | 'history' | 'settings';
  onTabChange?: (tab: 'analyze' | 'history' | 'settings') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab = 'analyze', onTabChange }) => {
  const { theme, getColors } = useThemeStore();
  const colors = getColors();

  const handleTabChange = (tab: 'analyze' | 'history' | 'settings') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header with Team Logo and Name */}
      <header 
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          boxShadow: `0 2px 4px ${colors.shadow}`
        }}
      >
        <div className="flex items-center space-x-3">
          {/* Team Logo */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <img 
              src="/hkjs_logo.png" 
              alt="HK-JOINT-SCHOOL" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Team Name */}
          <div>
            <h1 
              className="text-lg font-bold"
              style={{ color: colors.text }}
            >
              HK-Joint-School
            </h1>
            <p 
              className="text-xs"
              style={{ color: colors.textSecondary }}
            >
              iGEM 2025
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => useThemeStore.getState().toggleTheme()}
          className="p-2 rounded-full transition-colors"
          style={{ 
            backgroundColor: theme === 'dark' ? colors.surface : colors.border,
            color: colors.text 
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Main Content */}
      <main 
        className="flex-1 overflow-y-auto"
        style={{
          // Reserve space so fixed bottom nav doesn't cover content
          paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation (fixed for mobile) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 flex justify-around py-2 border-t"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          boxShadow: `0 -2px 4px ${colors.shadow}`,
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <button
          onClick={() => handleTabChange('analyze')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
            currentTab === 'analyze' ? 'scale-105' : ''
          }`}
          style={{
            backgroundColor: currentTab === 'analyze' ? iGEMColors.primary : 'transparent',
            color: currentTab === 'analyze' ? 'white' : colors.textSecondary
          }}
        >
          <span className="text-2xl mb-1">🔬</span>
          <span className="text-sm font-medium">Analyze</span>
        </button>

        <button
          onClick={() => handleTabChange('history')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
            currentTab === 'history' ? 'scale-105' : ''
          }`}
          style={{
            backgroundColor: currentTab === 'history' ? iGEMColors.primary : 'transparent',
            color: currentTab === 'history' ? 'white' : colors.textSecondary
          }}
        >
          <span className="text-2xl mb-1">📊</span>
          <span className="text-sm font-medium">History</span>
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
            currentTab === 'settings' ? 'scale-105' : ''
          }`}
          style={{
            backgroundColor: currentTab === 'settings' ? iGEMColors.primary : 'transparent',
            color: currentTab === 'settings' ? 'white' : colors.textSecondary
          }}
        >
          <span className="text-2xl mb-1">⚙️</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
}; 