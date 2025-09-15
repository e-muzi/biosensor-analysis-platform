import React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useModeStore } from "../../../../state/modeStore";

// Capture Headers
export const CaptureHeader: React.FC = () => {
  const { detectionMode } = useModeStore();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Pesticide Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {detectionMode === 'calibration' 
            ? "Capture or upload an image of your test strip with calibration strips for analysis"
            : "Capture or upload an image of your test strip for brightness analysis"
          }
        </Typography>
      </Box>
      
      {detectionMode === 'normalization' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Normalization Mode:</strong> The app will analyze brightness directly without calibration strips. 
            Make sure your test strip is well-lit and positioned clearly in the frame.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};
