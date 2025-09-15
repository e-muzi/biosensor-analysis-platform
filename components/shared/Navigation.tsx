import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { CameraAlt, History, Settings } from '@mui/icons-material';
import { useThemeStore } from '../../state/themeStore';
import type { Screen } from '../../types';

// This component is not used now
interface NavigationProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeScreen, onScreenChange }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  const navItems: { screen: Screen; label: string; icon: React.ReactNode }[] = [
    { 
      screen: 'capture', 
      label: 'Analyze', 
      icon: <CameraAlt />
    },
    { 
      screen: 'history', 
      label: 'History', 
      icon: <History />
    },
    { 
      screen: 'settings', 
      label: 'Settings', 
      icon: <Settings />
    },
  ];

  const getValue = () => {
    return navItems.findIndex(item => item.screen === activeScreen);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    const selectedItem = navItems[newValue];
    if (selectedItem && selectedItem.screen !== 'analysis') {
      onScreenChange(selectedItem.screen);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '7xl',
        margin: '0 auto',
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        value={getValue()}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: colors.surface,
          borderTop: `1px solid ${colors.border}`,
          '& .MuiBottomNavigationAction-root': {
            color: colors.textSecondary,
            '&.Mui-selected': {
              color: '#009B48', // iGEM Green
            },
          },
        }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={item.screen}
            label={item.label}
            icon={item.icon}
            value={index}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}; 