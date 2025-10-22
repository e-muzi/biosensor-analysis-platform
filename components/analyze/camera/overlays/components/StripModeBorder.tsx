import React from 'react';
import { Box } from '@mui/material';

interface StripModeBorderProps {
  videoWidth: number;
  videoHeight: number;
}

export const StripModeBorder: React.FC<StripModeBorderProps> = () => {
  // Calculate border dimensions - wider border to make width longer than height
  const borderHeightPercent = 0.3; // 30% of video height
  const borderWidthPercent = 0.8; // 80% of video width (increased from 60%)

  // Center the border horizontally and vertically
  const leftPercent = (1 - borderWidthPercent) / 2;
  const topPercent = (1 - borderHeightPercent) / 2;

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${leftPercent * 100}%`,
        top: `${topPercent * 100}%`,
        width: `${borderWidthPercent * 100}%`,
        height: `${borderHeightPercent * 100}%`,
        border: '3px solid #4CAF50', // Green border matching app theme
        borderRadius: 1,
        boxShadow: '0 0 20px rgba(76, 175, 80, 0.5)',
        zIndex: 10,
        pointerEvents: 'none', // Don't interfere with camera interactions
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -3,
          left: -3,
          right: -3,
          bottom: -3,
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: 1,
        },
      }}
    >
      {/* Corner indicators for better visual guidance */}
      {[
        { top: -6, left: -6 },
        { top: -6, right: -6 },
        { bottom: -6, left: -6 },
        { bottom: -6, right: -6 },
      ].map((position, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: 12,
            height: 12,
            border: '2px solid #4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            ...position,
          }}
        />
      ))}
    </Box>
  );
};
