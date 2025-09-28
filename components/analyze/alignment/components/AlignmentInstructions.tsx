import React from 'react';
import { Paper, Typography } from '@mui/material';

interface AlignmentInstructionsProps {
  isDragging: boolean;
  isPanning: boolean;
}

// Alignment Instructions
export const AlignmentInstructions: React.FC<AlignmentInstructionsProps> = ({
  isDragging,
  isPanning,
}) => {
  return (
    <>
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ textAlign: 'center', mt: 1 }}
      >
        {isDragging
          ? 'Drag to move the selection'
          : isPanning
            ? 'Drag to pan the image beneath the selection'
            : 'Drag inside the selection to move it, or drag elsewhere to pan the image'}
      </Typography>

      <Paper
        sx={{
          textAlign: 'center',
          p: 3,
          mt: 3,
          maxWidth: 'md',
          mx: 'auto',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          <Typography
            component='span'
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            Manual Alignment:
          </Typography>{' '}
          Drag the highlighted area to precisely crop the test kit.
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          <Typography
            component='span'
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            Auto-Crop:
          </Typography>{' '}
          Use the improved detection algorithm to automatically crop the test
          kit area.
        </Typography>
      </Paper>
    </>
  );
};
