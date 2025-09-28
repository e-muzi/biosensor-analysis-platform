import React from 'react';
import { Box } from '@mui/material';
import { AppHeader } from './layout/components/AppHeader';
import { MainContent } from './layout/components/MainContent';
import { BottomNav } from './layout/components/BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: 'analyze' | 'history' | 'settings';
  onTabChange?: (tab: 'analyze' | 'history' | 'settings') => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentTab = 'analyze',
  onTabChange,
}) => {
  const handleTabChange = (tab: 'analyze' | 'history' | 'settings') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        touchAction: 'pan-y',
      }}
    >
      <AppHeader />
      <MainContent>{children}</MainContent>
      <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
    </Box>
  );
};
