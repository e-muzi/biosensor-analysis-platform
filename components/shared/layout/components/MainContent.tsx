import React from "react";
import { Box } from "@mui/material";

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <Box 
      component="main" 
      sx={{ 
        flex: 1, 
        overflow: "auto",
        paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
        paddingX: { xs: 2, sm: 3, md: 4 }, 
        paddingY: 2 
      }}
    >
      {children}
    </Box>
  );
};
