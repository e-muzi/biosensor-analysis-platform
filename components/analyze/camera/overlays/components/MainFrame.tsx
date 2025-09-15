import React from "react";
import { Box, Typography } from "@mui/material";

// Main Frame
export const MainFrame: React.FC = () => {
  return (
    <Box 
      sx={{
        position: "absolute",
        inset: 0,
        border: 4,
        borderColor: "cyan.400",
        borderStyle: "dashed",
        borderRadius: 1
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          top: -32,
          left: "50%",
          transform: "translateX(-50%)",
          color: "cyan.400",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          px: 1.5,
          py: 0.5,
          borderRadius: "16px",
          fontWeight: 500
        }}
      >
        Position Test Kit Here
      </Typography>
    </Box>
  );
};
