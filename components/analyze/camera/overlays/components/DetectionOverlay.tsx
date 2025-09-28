import React from 'react';
import { Box, Typography } from '@mui/material';

// Detection Overlay
interface DetectionOverlayProps {
  detectedBounds: { x: number; y: number; width: number; height: number };
  videoWidth: number;
  videoHeight: number;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  detectedBounds,
  videoWidth,
  videoHeight,
}) => {
  const overlayStyle = {
    position: 'absolute' as const,
    left: `${(detectedBounds.x / videoWidth) * 100}%`,
    top: `${(detectedBounds.y / videoHeight) * 100}%`,
    width: `${(detectedBounds.width / videoWidth) * 100}%`,
    height: `${(detectedBounds.height / videoHeight) * 100}%`,
  };

  return (
    <>
      {/* Calibration strips */}
      <Box
        sx={{
          ...overlayStyle,
          border: 2,
          borderColor: 'green.500',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          zIndex: 5,
        }}
      >
        <Typography
          variant='caption'
          sx={{
            position: 'absolute',
            top: -24,
            left: 0,
            color: 'green.400',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontSize: '0.75rem',
          }}
        >
          Calibration
        </Typography>
      </Box>

      {/* Test areas */}
      <Box
        sx={{
          ...overlayStyle,
          border: 2,
          borderColor: 'green.400',
          borderStyle: 'dashed',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          zIndex: 4,
        }}
      >
        <Typography
          variant='caption'
          sx={{
            position: 'absolute',
            top: -24,
            left: 0,
            color: 'green.400',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontSize: '0.75rem',
          }}
        >
          Test Areas
        </Typography>
      </Box>

      {/* Test strips */}
      <Box
        sx={{
          ...overlayStyle,
          border: 2,
          borderColor: 'cyan.400',
          borderStyle: 'dashed',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          zIndex: 3,
        }}
      >
        <Typography
          variant='caption'
          sx={{
            position: 'absolute',
            top: -24,
            left: 0,
            color: 'cyan.400',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontSize: '0.75rem',
          }}
        >
          Test Strips
        </Typography>
      </Box>
    </>
  );
};
