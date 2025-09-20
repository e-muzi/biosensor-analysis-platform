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
        paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))", // Bottom nav height + buffer + safe area
        paddingTop: "env(safe-area-inset-top, 0px)", // Add top safe area padding
        paddingX: { xs: 2, sm: 3, md: 4 }, 
        paddingY: 2,
        minHeight: "calc(100vh - 120px)", // Ensure minimum height for content
        touchAction: "pan-y" // Allow vertical scrolling
      }}
    >
      {children}
    </Box>
  );
};
