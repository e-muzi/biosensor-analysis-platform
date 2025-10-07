import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { useThemeStore, iGEMColors } from '../../../../state/themeStore';
const hkjs_logo = '/hkjs_logo.PNG';

export function AppHeader() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: iGEMColors.primary,
        color: 'white',
      }}
    >
      <Toolbar>
        <Box
          component='img'
          sx={{
            height: 40,
            width: 40,
            maxHeight: { xs: 40, md: 40 },
            maxWidth: { xs: 40, md: 40 },
            marginRight: 2,
          }}
          alt='Team Logo'
          src={hkjs_logo}
        />
        <Typography variant='h4' sx={{ flexGrow: 1 }}>
          PestiGuard Analysis Platform
        </Typography>

        <IconButton
          color='inherit'
          onClick={toggleTheme}
          aria-label='toggle theme'
        >
          {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
