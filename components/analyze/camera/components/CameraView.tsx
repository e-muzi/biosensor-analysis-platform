import React from "react";
import { Box, Chip } from "@mui/material";
import { CameraOverlays } from "../Overlays";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady?: boolean;
}

// Camera View - Full camera view with pesticide guide dots
export const CameraView: React.FC<CameraViewProps> = ({ 
  videoRef, 
  isVideoReady = false
}) => {
  return (
    <Box sx={{ flex: 1, position: "relative", height: "100%" }}>
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        playsInline
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
      
      {/* Pesticide guide dots overlay */}
      <CameraOverlays 
        videoWidth={videoRef.current?.videoWidth || 0}
        videoHeight={videoRef.current?.videoHeight || 0}
      />

      {/* Video ready status indicator */}
      {!isVideoReady && (
        <Chip
          label="🔄 Initializing camera..."
          sx={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 152, 0, 0.8)",
            color: "white",
            zIndex: 5
          }}
        />
      )}
    </Box>
  );
};
