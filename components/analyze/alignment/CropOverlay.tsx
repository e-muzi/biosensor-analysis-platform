import React from 'react';
import { Box, Typography } from '@mui/material';

interface CropOverlayProps {
  cropBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  canvasWidth: number;
  canvasHeight: number;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

// Crop Overlay
export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropBounds,
  canvasWidth,
  canvasHeight,
  primaryColor,
  surfaceColor,
  borderColor
}) => {
  const overlayStyle = {
    position: 'absolute' as const,
    border: `2px solid ${primaryColor}`,
    pointerEvents: 'none' as const,
    left: `${(cropBounds.x / canvasWidth) * 100}%`,
    top: `${(cropBounds.y / canvasHeight) * 100}%`,
    width: `${(cropBounds.width / canvasWidth) * 100}%`,
    height: `${(cropBounds.height / canvasHeight) * 100}%`,
    zIndex: 10
  };

  const labelStyle = {
    position: 'absolute' as const,
    top: -32,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 12px',
    fontSize: '0.875rem',
    borderRadius: '16px',
    fontWeight: 500,
    backgroundColor: surfaceColor,
    color: primaryColor,
    border: `1px solid ${borderColor}`,
    opacity: 0.9
  };

  return (
    <Box sx={overlayStyle}>
      <Typography sx={labelStyle}>
        Crop Area
      </Typography>
    </Box>
  );
};
