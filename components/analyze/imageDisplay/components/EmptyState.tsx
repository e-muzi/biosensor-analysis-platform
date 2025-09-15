import React from "react";
import { Box, Typography } from "@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";

// Empty State handle
export const EmptyState: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        px: 2,
        color: "text.secondary"
      }}
    >
      <CameraAltIcon sx={{ fontSize: 48, mx: "auto", display: "block", mb: 1 }} />
      <Typography variant="body2">
        Upload or capture an image of the kit
      </Typography>
    </Box>
  );
};
