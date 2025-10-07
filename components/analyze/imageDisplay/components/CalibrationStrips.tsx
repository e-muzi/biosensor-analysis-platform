import React from 'react';
import { Box, Typography } from '@mui/material';
import { CALIBRATION_STRIPS } from '../../../../utils/constants/roiConstants';

// Calibration Strips
export const CalibrationStrips: React.FC = () => {
  return (
    <>
      {CALIBRATION_STRIPS.map(strip => (
        <Box key={`strip-${strip.name}`}>
          {/* Main calibration strip area */}
          <Box
            sx={{
              position: 'absolute',
              border: 1,
              borderColor: 'green.400',
              borderStyle: 'dashed',
              pointerEvents: 'none',
              backgroundColor: 'transparent',
              top: `${strip.roi.y * 100}%`,
              left: `${strip.roi.x * 100}%`,
              width: `${strip.roi.width * 100}%`,
              height: `${strip.roi.height * 100}%`,
              zIndex: 1,
            }}
          >
            <Typography
              variant='caption'
              sx={{
                position: 'absolute',
                top: -15,
                left: 0,
                color: 'green.400',
                px: 0.3,
                backgroundColor: 'background.paper',
                opacity: 0.9,
                borderRadius: 0.5,
                fontSize: '0.65rem',
                fontWeight: 'bold',
              }}
            >
              {strip.name}
            </Typography>
          </Box>

          {/* Show individual calibration segments (vertical) */}
          {strip.concentrations.map((conc, segIndex) => (
            <Box
              key={`segment-${strip.name}-${segIndex}`}
              sx={{
                position: 'absolute',
                border: 0.5,
                borderColor: 'green.300',
                opacity: 0.3,
                pointerEvents: 'none',
                backgroundColor: 'transparent',
                top: `${(strip.roi.y + (segIndex * strip.roi.height) / 5) * 100}%`,
                left: `${strip.roi.x * 100}%`,
                width: `${strip.roi.width * 100}%`,
                height: `${(strip.roi.height / 5) * 100}%`,
                zIndex: 1,
              }}
            >
              <Typography
                variant='caption'
                sx={{
                  position: 'absolute',
                  top: -10,
                  left: 0,
                  color: 'green.300',
                  px: 0.2,
                  backgroundColor: 'background.paper',
                  opacity: 0.8,
                  borderRadius: 0.3,
                  fontSize: '0.6rem',
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
