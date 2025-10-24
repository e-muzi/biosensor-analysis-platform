import React from 'react';
import { Box, Typography } from '@mui/material';
import { PESTICIDE_CENTER_POINTS } from '../../../../../utils/constants/roiConstants';

interface PesticideGuideDotsProps {
  videoWidth: number;
  videoHeight: number;
}

export const PesticideGuideDots: React.FC<PesticideGuideDotsProps> = () => {
  // Always show the dots, using percentage-based positioning like the green boxes
  // Keep original positions for capture mode - analysis will use different coordinates

  return (
    <>
      {PESTICIDE_CENTER_POINTS.map(pesticide => {
        return (
          <Box key={pesticide.name}>
            {/* Guide dot positioned at the center of the green box */}
            <Box
              sx={{
                position: 'absolute',
                left: `${pesticide.roi.x * 100}%`,
                top: `${pesticide.roi.y * 100}%`,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'red',
                border: '2px solid white',
                zIndex: 15, // Higher than green boxes
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(255, 0, 0, 0.8)',
              }}
            />

            {/* Pesticide label */}
            <Typography
              variant='caption'
              sx={{
                position: 'absolute',
                left: `${pesticide.roi.x * 100}%`,
                top: `${pesticide.roi.y * 100}%`,
                transform: 'translate(-50%, -120%)',
                color: 'red',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                px: 0.5,
                py: 0.2,
                borderRadius: 0.5,
                fontSize: '0.6rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                zIndex: 15,
                border: '1px solid red',
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
