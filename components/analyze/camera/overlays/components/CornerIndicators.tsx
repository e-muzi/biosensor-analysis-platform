import React from 'react';
import { Box } from '@mui/material';

// Corner Indicators
export const CornerIndicators: React.FC = () => {
  return (
    <>
      {/* Top-left corner */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 24,
          height: 24,
          borderLeft: 2,
          borderTop: 2,
          borderColor: 'cyan.400',
        }}
      />
      {/* Top-right corner */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRight: 2,
          borderTop: 2,
          borderColor: 'cyan.400',
        }}
      />
      {/* Bottom-left corner */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          width: 24,
          height: 24,
          borderLeft: 2,
          borderBottom: 2,
          borderColor: 'cyan.400',
        }}
      />
      {/* Bottom-right corner */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRight: 2,
          borderBottom: 2,
          borderColor: 'cyan.400',
        }}
      />
    </>
  );
};
