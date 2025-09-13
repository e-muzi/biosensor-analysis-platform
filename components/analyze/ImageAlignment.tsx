import React, { useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { AppButton } from '../shared';
import { AlignmentHeader } from './alignment/Header';
import { CanvasStage } from './alignment/CanvasStage';
import { CropOverlay } from './alignment/CropOverlay';
import { AlignmentControls } from './alignment/Controls';
import { useAlignmentCanvas } from './alignment/useAlignmentCanvas';

// This component allows users to align and crop the test kit area from an uploaded image
interface ImageAlignmentProps {
  imageSrc: string;
  onConfirm: (alignedImageSrc: string) => void;
  onBack: () => void;
}

export const ImageAlignment: React.FC<ImageAlignmentProps> = ({ imageSrc, onConfirm, onBack }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  const {
    canvasRef,
    imageRef,
    containerRef,
    imageDisplaySize,
    imageLoaded,
    cropBounds,
    isAutoDetecting,
    isDragging,
    isPanning,
    scale,
    rotation,
    handleImageLoad,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
    handleConfirmCrop,
    handleAutoCrop,
  } = useAlignmentCanvas(imageSrc);

  const onConfirmCrop = useCallback(async () => {
    const dataUrl = await handleConfirmCrop();
    if (dataUrl) onConfirm(dataUrl);
  }, [handleConfirmCrop, onConfirm]);

  const onAutoCrop = useCallback(async () => {
    const dataUrl = await handleAutoCrop();
    if (dataUrl) onConfirm(dataUrl);
  }, [handleAutoCrop, onConfirm]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AlignmentHeader 
        title="Align & Crop Test Kit"
        subtitle="Adjust the highlighted area to precisely crop your test kit"
        textColor={colors.text}
        subtitleColor={colors.textSecondary}
      />
      
      <Box ref={containerRef} sx={{ width: '100%', maxWidth: 'md', mx: 'auto' }}>
        <Paper
          sx={{
            position: 'relative',
            border: 2,
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
            borderColor: 'divider'
          }}
        >
          <CanvasStage 
            canvasRef={canvasRef}
            imageDisplaySize={imageDisplaySize}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          
          {/* Hidden image for reference */}
          <Box
            component="img"
            ref={imageRef}
            src={imageSrc}
            alt="Test kit"
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
            sx={{ display: 'none' }}
          />
          
          {/* Crop overlay */}
          {cropBounds && imageLoaded && canvasRef.current && (
            <CropOverlay 
              cropBounds={cropBounds}
              canvasWidth={canvasRef.current.width}
              canvasHeight={canvasRef.current.height}
              primaryColor={iGEMColors.primary}
              surfaceColor={colors.surface}
              borderColor={colors.border}
            />
          )}
          
          {/* Loading indicator */}
          <Backdrop
            open={isAutoDetecting}
            sx={{ 
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress 
                size={32}
                sx={{ 
                  color: iGEMColors.primary,
                  mb: 2
                }}
              />
              <Typography variant="body1" sx={{ color: 'white' }}>
                Detecting test kit...
              </Typography>
            </Box>
          </Backdrop>
        </Paper>
        
        <AlignmentControls 
          scale={scale}
          rotation={rotation}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onReset={handleResetTransform}
          colors={{ background: colors.surface, text: colors.text, border: colors.border }}
          accentColor={iGEMColors.accent}
        />

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ textAlign: 'center', mt: 1 }}
        >
          {isDragging
            ? 'Drag to move the selection'
            : isPanning
              ? 'Drag to pan the image beneath the selection'
              : 'Drag inside the selection to move it, or drag elsewhere to pan the image'}
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ maxWidth: 'md', mx: 'auto', mt: 4 }}>
        <Grid item xs={12} sm={4}>
          <AppButton onClick={onBack} variant="outline" fullWidth>
            ← Back
          </AppButton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppButton 
            onClick={onAutoCrop} 
            disabled={!imageLoaded}
            variant="secondary"
            fullWidth
          >
            �� Auto-Crop
          </AppButton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppButton 
            onClick={onConfirmCrop} 
            disabled={!cropBounds || !imageLoaded}
            variant="primary"
            fullWidth
          >
            ✅ Confirm Crop
          </AppButton>
        </Grid>
      </Grid>
      
      <Paper 
        sx={{ 
          textAlign: 'center',
          p: 3,
          mt: 3,
          maxWidth: 'md',
          mx: 'auto',
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Manual Alignment:
          </Typography>{' '}
          Drag the highlighted area to precisely crop the test kit.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Auto-Crop:
          </Typography>{' '}
          Use the improved detection algorithm to automatically crop the test kit area.
        </Typography>
      </Paper>
    </Container>
  );
};
