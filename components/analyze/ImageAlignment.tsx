import { Box, Container, Typography } from '@mui/material';
import { CanvasStage } from './alignment/CanvasStage';
import { AlignmentControls } from './alignment/Controls';
import { useAlignmentCanvas } from './alignment/useAlignmentCanvas';
import { useThemeStore } from '../../state/themeStore';

interface ImageAlignmentProps {
  imageSrc: string;
  onConfirm: (alignedImageSrc: string, dotPositions: Array<{ name: string; x: number; y: number }>) => void;
}

export function ImageAlignment({ imageSrc, onConfirm }: ImageAlignmentProps) {
  const { getColors } = useThemeStore();
  const colors = getColors();

  const {
    canvasRef,
    imageRef,
    scale,
    rotation,
    imageTransform,
    dots,
    handleConfirm,
    handleDotMove,
    handleResetDots,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
    setLocalImageDisplaySize,
  } = useAlignmentCanvas(imageSrc, onConfirm);

  return (
    <Container maxWidth='md' sx={{ py: 3, pb: 12 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant='h4' sx={{ mb: 1 }}>
          Align Test Kit
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Drag the dots to align them with the test areas, then confirm
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CanvasStage
          canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
          imageRef={imageRef as React.RefObject<HTMLImageElement>}
          imageSrc={imageSrc}
          scale={scale}
          rotation={rotation}
          imageTransform={imageTransform}
          dots={dots}
          onDotMove={handleDotMove}
          onResetDots={handleResetDots}
          setLocalImageDisplaySize={setLocalImageDisplaySize}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AlignmentControls
            scale={scale}
            rotation={rotation}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            onReset={handleResetTransform}
            colors={colors}
            accentColor='#FFD700'
          />
          <button
            onClick={handleConfirm}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Confirm Alignment
          </button>
        </Box>
      </Box>
    </Container>
  );
}
