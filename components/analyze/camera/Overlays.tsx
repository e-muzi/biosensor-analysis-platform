import React from "react";
import { Box } from "@mui/material";
import { MainFrame } from "./overlays/components/MainFrame";
import { DetectionOverlay } from "./overlays/components/DetectionOverlay";
import { CornerIndicators } from "./overlays/components/CornerIndicators";

interface CameraOverlaysProps {
  detectedBounds: { x: number; y: number; width: number; height: number } | null;
  videoWidth: number;
  videoHeight: number;
}

// Camera Overlays
export const CameraOverlays: React.FC<CameraOverlaysProps> = ({ 
  detectedBounds, 
  videoWidth, 
  videoHeight 
}) => {
  if (videoWidth === 0 || videoHeight === 0) return null;

  return (
    <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ position: "relative", width: "90vmin", height: "60vmin", maxWidth: 600, maxHeight: 400 }}>
        <MainFrame />
        
        {detectedBounds && (
          <DetectionOverlay 
            detectedBounds={detectedBounds}
            videoWidth={videoWidth}
            videoHeight={videoHeight}
          />
        )}
        
        <CornerIndicators />
      </Box>
    </Box>
  );
};
