import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import { 
  Science as ScienceIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useThemeStore, iGEMColors } from '../../state/themeStore';

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: 'analyze' | 'history' | 'settings';
  onTabChange?: (tab: 'analyze' | 'history' | 'settings') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab = 'analyze', onTabChange }) => {
  const { theme, toggleTheme } = useThemeStore();

  const handleTabChange = (tab: 'analyze' | 'history' | 'settings') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const getTabValue = () => {
    switch (currentTab) {
      case 'analyze': return 0;
      case 'history': return 1;
      case 'settings': return 2;
      default: return 0;
    }
  };

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0: handleTabChange('analyze'); break;
      case 1: handleTabChange('history'); break;
      case 2: handleTabChange('settings'); break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header with Team Logo and Name */}
      <AppBar 
        position="static" 
        elevation={2}
        sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Team Logo */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${iGEMColors.primary}, ${iGEMColors.primaryDark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src="/hkjs_logo.png" 
                alt="HK-JOINT-SCHOOL" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            
            {/* Team Name */}
            <Box>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                HK-Joint-School
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
                iGEM 2025
              </Typography>
            </Box>
          </Box>

          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              backgroundColor: theme === 'dark' ? 'background.paper' : 'grey.200',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'grey.700' : 'grey.300',
              }
            }}
          >
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper 
        elevation={8}
        sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTop: 1,
          borderColor: 'divider',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        <BottomNavigation
          value={getTabValue()}
          onChange={handleBottomNavChange}
          showLabels
          sx={{
            backgroundColor: 'background.paper',
            '& .MuiBottomNavigationAction-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                backgroundColor: 'transparent',
                '& .MuiBottomNavigationAction-label': {
                  fontWeight: 'bold',
                }
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }
          }}
        >
          <BottomNavigationAction
            label="Analyze"
            icon={<ScienceIcon />}
            sx={{
              '&.Mui-selected': {
                backgroundColor: iGEMColors.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: iGEMColors.primaryDark,
                }
              }
            }}
          />
          <BottomNavigationAction
            label="History"
            icon={<HistoryIcon />}
            sx={{
              '&.Mui-selected': {
                backgroundColor: iGEMColors.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: iGEMColors.primaryDark,
                }
              }
            }}
          />
          <BottomNavigationAction
            label="Settings"
            icon={<SettingsIcon />}
            sx={{
              '&.Mui-selected': {
                backgroundColor: iGEMColors.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: iGEMColors.primaryDark,
                }
              }
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
