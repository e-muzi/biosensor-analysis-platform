import { createTheme, ThemeOptions } from '@mui/material/styles';
import { darkPalette } from './palettes';
import { typography } from './typography';
import { darkComponents } from './components';
import { shadows } from './shadows';

export const darkTheme = createTheme({
  palette: darkPalette,
  typography,
  shadows,
  shape: {
    borderRadius: 8,
  },
  components: darkComponents,
});
