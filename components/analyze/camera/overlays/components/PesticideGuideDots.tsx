import React from "react";
import { Box, Typography } from "@mui/material";
import { PESTICIDE_COORDINATES } from "../../../../../utils/constants/roiConstants";

interface PesticideGuideDotsProps {
  videoWidth: number;
  videoHeight: number;
}

// Pesticide Guide Dots - Shows small dots at specific pixel coordinates
export const PesticideGuideDots: React.FC<PesticideGuideDotsProps> = ({ 
  videoWidth, 
  videoHeight 
}) => {
  // Use default dimensions if video dimensions are not available yet
  const displayWidth = videoWidth || 1920;
  const displayHeight = videoHeight || 1080;

  return (
    <>
      {PESTICIDE_COORDINATES.map((pesticide) => {
        // Convert pixel coordinates to percentage for responsive positioning
        const xPercent = (pesticide.x / displayWidth) * 100;
        const yPercent = (pesticide.y / displayHeight) * 100;

        return (
          <Box key={pesticide.name}>
            {/* Guide dot */}
            <Box
              sx={{
                position: "absolute",
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "red",
                border: "2px solid white",
                zIndex: 6,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 8px rgba(255, 0, 0, 0.8)"
              }}
            />
            
            {/* Pesticide label */}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: "translate(-50%, -120%)",
                color: "red",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                px: 0.5,
                py: 0.2,
                borderRadius: 0.5,
                fontSize: "0.6rem",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                zIndex: 6,
                border: "1px solid red"
              }}
            >
              {pesticide.name}
            </Typography>
          </Box>
        );
      })}
    </>
  );
};
