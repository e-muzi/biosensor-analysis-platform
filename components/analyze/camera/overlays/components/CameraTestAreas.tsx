import React from "react";
import { Box } from "@mui/material";
import { PESTICIDE_ROIS } from "../../../../../utils/constants/roiConstants";

interface CameraTestAreasProps {
  videoWidth: number;
  videoHeight: number;
}

// Camera-specific Test Areas - Simplified to always show
export const CameraTestAreas: React.FC<CameraTestAreasProps> = ({ 
  videoWidth, 
  videoHeight 
}) => {
  // Always show the boxes, even if video dimensions are not available yet
  // Use percentage-based positioning like the original TestAreas component
  
  console.log('CameraTestAreas rendering with dimensions:', { videoWidth, videoHeight });
  
  return (
    <>
      {PESTICIDE_ROIS.map(({name, roi}) => (
        <Box
          key={name}
          sx={{
            position: "absolute",
            left: `${roi.x * 100}%`,
            top: `${roi.y * 100}%`,
            width: `${roi.width * 100}%`,
            height: `${roi.height * 100}%`,
            border: "2px solid", // Make border thicker for visibility
            borderColor: "green", // Use green color directly
            backgroundColor: "rgba(0, 255, 0, 0.1)", // Add slight green background
            pointerEvents: "none",
            borderRadius: 1,
            zIndex: 10, // Higher z-index to ensure visibility
          }}
        />
      ))}
    </>
  );
};
