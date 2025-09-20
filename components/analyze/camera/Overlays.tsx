import React from "react";
import { Box } from "@mui/material";
import { PesticideGuideDots } from "./overlays/components/PesticideGuideDots";
import { CameraTestAreas } from "./overlays/components/CameraTestAreas";

interface CameraOverlaysProps {
  videoWidth: number;
  videoHeight: number;
}

// Camera Overlays - Full camera view with pesticide guide dots and green ROI boxes
export const CameraOverlays: React.FC<CameraOverlaysProps> = ({ 
  videoWidth, 
  videoHeight 
}) => {
  // Use default dimensions if video dimensions are not available yet
  const displayWidth = videoWidth || 1920;
  const displayHeight = videoHeight || 1080;

  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      {/* Green ROI boxes for pesticide test areas - always visible */}
      <CameraTestAreas 
        videoWidth={displayWidth}
        videoHeight={displayHeight}
      />
      
      {/* Pesticide guide dots at specific coordinates - always visible */}
      <PesticideGuideDots 
        videoWidth={displayWidth}
        videoHeight={displayHeight}
      />
    </Box>
  );
};
