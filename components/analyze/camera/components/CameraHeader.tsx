import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

// Camera Header - Full camera view
export const CameraHeader: React.FC = () => {
  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        p: 2,
        borderRadius: 0,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h6' component='h3' gutterBottom>
          Position Test Kit
        </Typography>
        <Typography variant='body2' sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Align the test kit with the red guide dots. The entire camera view
          will be captured for analysis.
        </Typography>
      </Box>
    </Paper>
  );
};
