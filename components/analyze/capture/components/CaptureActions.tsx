import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { AppButton } from '../../../shared';
import { ImageUpload } from '../../ImageUpload';

interface CaptureActionsProps {
  onOpenCamera: () => void;
  onImageSelect: (src: string) => void;
}

export const CaptureActions: React.FC<CaptureActionsProps> = ({
  onOpenCamera,
  onImageSelect,
}) => {
  const handleDownloadTestImage = () => {
    const downloadUrl = 'https://drive.google.com/uc?export=download&id=1JXmKqK50On_ps5nQjMfw_BDW3u_rRHlc';
    window.open(downloadUrl, '_blank');
  };
  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', px: 2 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <AppButton
            onClick={onOpenCamera}
            variant='primary'
            fullWidth
            size='large'
          >
            📷 Use Camera
          </AppButton>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ImageUpload
            onImageSelect={onImageSelect}
            onOpenCamera={onOpenCamera}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <AppButton
            onClick={handleDownloadTestImage}
            variant='secondary'
            fullWidth
            size='large'
          >
            📥 Download Test Image
          </AppButton>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          mx: 2,
        }}
      >
        <Typography variant='caption' color='text.secondary'>
          💡 Tip: Ensure good lighting and a clear view of the test strip
        </Typography>
      </Paper>
    </Box>
  );
};
