import { createTheme, ThemeOptions } from '@mui/material/styles';
import { lightPalette } from './palettes';
import { typography } from './typography';
import { lightComponents } from './components';
import { shadows } from './shadows';

export const lightTheme = createTheme({
  palette: lightPalette,
  typography,
  shadows,
  shape: {
    borderRadius: 8,
  },
  components: lightComponents,
});
