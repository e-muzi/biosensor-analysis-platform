import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { AppButton } from "../../../shared";
import { ImageUpload } from "../../ImageUpload";

interface CaptureActionsProps {
  onOpenCamera: () => void;
  onImageSelect: (src: string) => void;
}

// Capture Actions
export const CaptureActions: React.FC<CaptureActionsProps> = ({
  onOpenCamera,
  onImageSelect
}) => {
  return (
    <Box sx={{ maxWidth: "md", mx: "auto" }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppButton 
            onClick={onOpenCamera} 
            variant="primary"
            fullWidth
            size="large"
          >
            📷 Use Camera
          </AppButton>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ImageUpload onImageSelect={onImageSelect} onOpenCamera={onOpenCamera} />
        </Grid>
      </Grid>
      
      <Paper 
        sx={{ 
          p: 2, 
          textAlign: "center",
          backgroundColor: "background.paper",
          border: 1,
          borderColor: "divider"
        }}
      >
        <Typography variant="caption" color="text.secondary">
          💡 Tip: Ensure good lighting and a clear view of the test strip
        </Typography>
      </Paper>
    </Box>
  );
};
