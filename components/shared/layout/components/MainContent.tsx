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
        overflowY: "scroll",
        WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
        paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))", // Bottom nav height + buffer + safe area
        paddingTop: "env(safe-area-inset-top, 0px)", // Add top safe area padding
        paddingX: { xs: 2, sm: 3, md: 4 }, 
        paddingY: 2,
        minHeight: 0 // Allow flex item to shrink below content size
      }}
    >
      {children}
    </Box>
  );
};
