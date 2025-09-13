import React from 'react';
import { Box, Typography } from '@mui/material';

interface CameraOverlaysProps {
  detectedBounds: { x: number; y: number; width: number; height: number } | null;
  videoWidth: number;
  videoHeight: number;
}

export const CameraOverlays: React.FC<CameraOverlaysProps> = ({ 
  detectedBounds, 
  videoWidth, 
  videoHeight 
}) => {
  if (videoWidth === 0 || videoHeight === 0) return null;

  return (
    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', width: '90vmin', height: '60vmin', maxWidth: 600, maxHeight: 400 }}>
        {/* Main frame */}
        <Box 
          sx={{
            position: 'absolute',
            inset: 0,
            border: 4,
            borderColor: 'cyan.400',
            borderStyle: 'dashed',
            borderRadius: 1
          }}
        >
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: -32,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'cyan.400',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              px: 1.5,
              py: 0.5,
              borderRadius: '16px',
              fontWeight: 500
            }}
          >
            Position Test Kit Here
          </Typography>
        </Box>

        {/* Detected bounds overlay */}
        {detectedBounds && (
          <>
            {/* Calibration strips */}
            <Box
              sx={{
                position: 'absolute',
                border: 2,
                borderColor: 'green.500',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                left: `${(detectedBounds.x / videoWidth) * 100}%`,
                top: `${(detectedBounds.y / videoHeight) * 100}%`,
                width: `${(detectedBounds.width / videoWidth) * 100}%`,
                height: `${(detectedBounds.height / videoHeight) * 100}%`,
                zIndex: 5
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  color: 'green.400',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                Calibration
              </Typography>
            </Box>

            {/* Test areas */}
            <Box
              sx={{
                position: 'absolute',
                border: 2,
                borderColor: 'green.400',
                borderStyle: 'dashed',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                left: `${(detectedBounds.x / videoWidth) * 100}%`,
                top: `${(detectedBounds.y / videoHeight) * 100}%`,
                width: `${(detectedBounds.width / videoWidth) * 100}%`,
                height: `${(detectedBounds.height / videoHeight) * 100}%`,
                zIndex: 4
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  color: 'green.400',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                Test Areas
              </Typography>
            </Box>

            {/* Test strips */}
            <Box
              sx={{
                position: 'absolute',
                border: 2,
                borderColor: 'cyan.400',
                borderStyle: 'dashed',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                left: `${(detectedBounds.x / videoWidth) * 100}%`,
                top: `${(detectedBounds.y / videoHeight) * 100}%`,
                width: `${(detectedBounds.width / videoWidth) * 100}%`,
                height: `${(detectedBounds.height / videoHeight) * 100}%`,
                zIndex: 3
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  color: 'cyan.400',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                Test Strips
              </Typography>
            </Box>
          </>
        )}

        {/* Corner indicators */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 24,
            height: 24,
            borderLeft: 2,
            borderTop: 2,
            borderColor: 'cyan.400'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRight: 2,
            borderTop: 2,
            borderColor: 'cyan.400'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            width: 24,
            height: 24,
            borderLeft: 2,
            borderBottom: 2,
            borderColor: 'cyan.400'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRight: 2,
            borderBottom: 2,
            borderColor: 'cyan.400'
          }}
        />
      </Box>
    </Box>
  );
};
