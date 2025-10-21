import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { AlignmentCanvas } from './components/AlignmentCanvas';
import { useModeStore } from '../../../state/modeStore';
import { iGEMColors } from '../../../state/themeStore';
import type { MovableDot } from './hooks/useMovableDots';
import type { DotPosition } from './hooks/useMovableDots';

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  imageSrc: string;
  scale: number;
  rotation: number;
  imageTransform: { x: number; y: number; scale?: number };
  dots: MovableDot[];
  onDotMove: (dotName: string, position: DotPosition) => void;
  onResetDots: () => void;
  setLocalImageDisplaySize: (size: { width: number; height: number }) => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  canvasRef,
  imageRef,
  imageSrc,
  scale,
  rotation,
  imageTransform,
  dots,
  onDotMove,
  onResetDots,
  setLocalImageDisplaySize,
}) => {
  const [localImageDisplaySize, setLocalImageDisplaySizeLocal] = useState<{
    width: number;
    height: number;
  }>({ width: 400, height: 300 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const { detectionMode } = useModeStore();

  // Calculate image display size when image loads
  useEffect(() => {
    const image = imageRef.current;
    if (!image || !imageSrc) return;

    const handleImageLoad = () => {
      if (image.naturalWidth && image.naturalHeight) {
        // Calculate display size to match analysis page behavior
        // Use a square container like the analysis page (aspectRatio: "1/1")
        const containerSize = 400; // Fixed size for consistent positioning
        const imageAspectRatio = image.naturalWidth / image.naturalHeight;

        let displayWidth, displayHeight;

        if (imageAspectRatio > 1) {
          // Landscape image - fit to width
          displayWidth = containerSize;
          displayHeight = containerSize / imageAspectRatio;
        } else {
          // Portrait or square image - fit to height
          displayHeight = containerSize;
          displayWidth = containerSize * imageAspectRatio;
        }

        setLocalImageDisplaySizeLocal({
          width: displayWidth,
          height: displayHeight,
        });
        setLocalImageDisplaySize({
          width: displayWidth,
          height: displayHeight,
        });
        setImageLoaded(true);
      }
    };

    if (image.complete) {
      handleImageLoad();
    } else {
      image.addEventListener('load', handleImageLoad);
      return () => image.removeEventListener('load', handleImageLoad);
    }
  }, [imageSrc]);


  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden image for reference */}
      <Box
        component='img'
        ref={imageRef}
        src={imageSrc}
        onLoad={() => setImageLoaded(true)}
        crossOrigin='anonymous'
        sx={{ display: 'none' }}
      />
      
      <Box
        data-canvas-container
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 'md',
          aspectRatio: '1/1',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 2,
          borderStyle: 'dashed',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <AlignmentCanvas
          canvasRef={canvasRef}
          imageRef={imageRef}
          imageSrc={imageSrc}
          imageDisplaySize={localImageDisplaySize}
          cropBounds={null} // No crop bounds for alignment
          imageLoaded={imageLoaded}
          colors={{
            surface: 'rgba(255, 255, 255, 0.9)',
            border: iGEMColors.primary,
          }}
          dots={dots}
          onDotMove={onDotMove}
          onResetDots={onResetDots}
          onImageLoad={() => setImageLoaded(true)}
        />
      </Box>
    </Box>
  );
};
