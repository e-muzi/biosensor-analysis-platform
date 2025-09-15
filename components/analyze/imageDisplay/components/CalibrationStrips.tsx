import React from "react";
import { Box, Typography } from "@mui/material";
import { CALIBRATION_STRIPS } from "../../../../utils/analysis";

// Calibration Strips
export const CalibrationStrips: React.FC = () => {
  return (
    <>
      {CALIBRATION_STRIPS.map((strip) => (
        <Box key={`strip-${strip.name}`}>
          {/* Main calibration strip area */}
          <Box
            sx={{
              position: "absolute",
              border: 2,
              borderColor: "green.400",
              borderStyle: "dashed",
              pointerEvents: "none",
              top: `${strip.roi.y * 100}%`,
              left: `${strip.roi.x * 100}%`,
              width: `${strip.roi.width * 100}%`,
              height: `${strip.roi.height * 100}%`
            }}
          >
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: -20,
                left: 0,
                color: "green.400",
                px: 0.5,
                backgroundColor: "background.paper",
                opacity: 0.9,
                borderRadius: 0.5
              }}
            >
              {strip.name} Cal
            </Typography>
          </Box>
          
          {/* Show individual calibration segments (vertical) */}
          {strip.concentrations.map((conc, segIndex) => (
            <Box
              key={`segment-${strip.name}-${segIndex}`}
              sx={{
                position: "absolute",
                border: 1,
                borderColor: "green.300",
                opacity: 0.5,
                pointerEvents: "none",
                top: `${(strip.roi.y + (segIndex * strip.roi.height / 5)) * 100}%`,
                left: `${strip.roi.x * 100}%`,
                width: `${strip.roi.width * 100}%`,
                height: `${(strip.roi.height / 5) * 100}%`
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -12,
                  left: 0,
                  color: "green.300",
                  px: 0.5,
                  backgroundColor: "background.paper",
                  opacity: 0.9,
                  borderRadius: 0.5,
                  fontSize: "0.75rem"
                }}
              >
                {conc}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </>
  );
};
