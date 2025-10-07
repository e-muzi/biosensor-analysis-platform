import React, { useRef } from 'react';
import { Card, CardContent, Box, Chip } from '@mui/material';
import { ImageDisplay } from '../../ImageDisplay';
import { iGEMColors } from '../../../../state/themeStore';

interface ImagePreviewProps {
  imageSrc: string | null;
  isUploadedImage: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  isUploadedImage,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <Card
      sx={{
        maxWidth: 'md',
        mx: 'auto',
        mb: 4,
        border: 2,
        borderColor: 'divider',
        borderStyle: 'dashed',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <ImageDisplay ref={imageRef} imageSrc={imageSrc} showROIs={false} />
        {imageSrc && !isUploadedImage && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Chip
              label='✅ Auto-cropped test kit area ready for analysis'
              sx={{
                backgroundColor: `${iGEMColors.primary}20`,
                color: iGEMColors.primary,
                fontWeight: 'medium',
              }}
            />
          </Box>
        )}
        {imageSrc && isUploadedImage && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Chip
              label='📷 Uploaded image - use alignment tool for precise cropping'
              sx={{
                backgroundColor: `${iGEMColors.accent}20`,
                color: iGEMColors.accentDark,
                fontWeight: 'medium',
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
