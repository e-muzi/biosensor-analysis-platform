import React from 'react';
import { Box, Button, Paper, Grid, Chip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface AlignmentControlsProps {
  scale: number;
  rotation: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  colors: {
    background: string;
    text: string;
    border: string;
  };
  accentColor: string;
}

// Main Alignment Controls
export const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  scale,
  rotation,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onReset,
  colors,
  accentColor,
}) => {
  return (
    <Paper
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: colors.background,
        border: 1,
        borderColor: colors.border,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <Button
          variant='outlined'
          startIcon={<ZoomInIcon />}
          onClick={onZoomIn}
          size='small'
          sx={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
            '&:hover': {
              backgroundColor: colors.border,
            },
          }}
        >
          Zoom In
        </Button>

        <Button
          variant='outlined'
          startIcon={<ZoomOutIcon />}
          onClick={onZoomOut}
          size='small'
          sx={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
            '&:hover': {
              backgroundColor: colors.border,
            },
          }}
        >
          Zoom Out
        </Button>

        <Button
          variant='outlined'
          startIcon={<RotateLeftIcon />}
          onClick={onRotateLeft}
          size='small'
          sx={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
            '&:hover': {
              backgroundColor: colors.border,
            },
          }}
        >
          Rotate Left
        </Button>

        <Button
          variant='outlined'
          startIcon={<RotateRightIcon />}
          onClick={onRotateRight}
          size='small'
          sx={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
            '&:hover': {
              backgroundColor: colors.border,
            },
          }}
        >
          Rotate Right
        </Button>

        <Button
          variant='outlined'
          startIcon={<RefreshIcon />}
          onClick={onReset}
          size='small'
          sx={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
            '&:hover': {
              backgroundColor: colors.border,
            },
          }}
        >
          Reset
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid size={{ xs: 12 }}>
            <Chip
              label={`Scale: ${(scale * 100).toFixed(0)}%`}
              size='small'
              sx={{ backgroundColor: accentColor, color: 'black' }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Chip
              label={`Rotation: ${rotation}°`}
              size='small'
              sx={{ backgroundColor: accentColor, color: 'black' }}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

// Export as Controls for compatibility
export const Controls = AlignmentControls;
