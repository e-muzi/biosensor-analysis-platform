import React from "react";
import { Paper, Box, Typography } from "@mui/material";

interface CameraHeaderProps {
  detectedBounds: { x: number; y: number; width: number; height: number } | null;
}

// Camera Header
export const CameraHeader: React.FC<CameraHeaderProps> = ({ detectedBounds }) => {
  return (
    <Paper
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        p: 2,
        borderRadius: 0
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Position Test Kit
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          {detectedBounds ? 
            "✅ Test kit detected! Tap capture to analyze." : 
            "Align the test kit within the frame. The app will automatically detect and crop the test kit area."
          }
        </Typography>
      </Box>
    </Paper>
  );
};
