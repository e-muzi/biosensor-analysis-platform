import { lightTheme } from "./themes/lightTheme";
import { darkTheme } from "./themes/darkTheme";

// Theme selector function
export const getMuiTheme = (theme: "light" | "dark") => {
  return theme === "light" ? lightTheme : darkTheme;
};

// Re-export themes for backward compatibility
export { lightTheme, darkTheme };
