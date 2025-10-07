import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { AppButton } from '../../../shared';

interface ImageActionsProps {
  isUploadedImage: boolean;
  isAnalyzing: boolean;
  onClearImage: () => void;
  onAnalyze: () => void;
  onShowAlignment: () => void;
}

export const ImageActions: React.FC<ImageActionsProps> = ({
  isUploadedImage,
  isAnalyzing,
  onClearImage,
  onAnalyze,
  onShowAlignment,
}) => {
  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
      {!isUploadedImage && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant='body2' sx={{ mb: 1, textAlign: 'center' }}>
            <strong>Auto-crop completed!</strong>
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ textAlign: 'center' }}
          >
            You can proceed with analysis or adjust the crop if needed.
          </Typography>
        </Paper>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppButton onClick={onClearImage} variant='outline' fullWidth>
            Clear Image
          </AppButton>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppButton
            onClick={onAnalyze}
            disabled={isAnalyzing}
            variant='primary'
            fullWidth
          >
            {isAnalyzing ? '🔬 Analyzing...' : '🔬 Analyze'}
          </AppButton>
        </Grid>
      </Grid>

      <AppButton onClick={onShowAlignment} variant='secondary' fullWidth>
        {isUploadedImage ? '🔧 Adjust & Crop Image' : '🔧 Adjust Crop'}
      </AppButton>
    </Box>
  );
};
