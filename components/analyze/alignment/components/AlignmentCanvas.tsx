import React from 'react';
import {
  Box,
  Paper,
} from '@mui/material';
import { CropOverlay } from '../CropOverlay';
import { iGEMColors } from '../../../../state/themeStore';

interface AlignmentCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  imageDisplaySize: { width: number; height: number };
  cropBounds: { x: number; y: number; width: number; height: number } | null;
  imageLoaded: boolean;
  colors: { surface: string; border: string };
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseMove: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseUp: () => void;
  onImageLoad: () => void;
}

export const AlignmentCanvas: React.FC<AlignmentCanvasProps> = ({
  canvasRef,
  imageRef,
  imageDisplaySize,
  cropBounds,
  imageLoaded,
  colors,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onImageLoad,
}) => {
  return (
    <Paper
      sx={{
        position: 'relative',
        border: 2,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <canvas
        ref={canvasRef}
        width={imageDisplaySize.width}
        height={imageDisplaySize.height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: 'grab',
          position: 'relative',
          zIndex: 0,
          pointerEvents: 'auto',
        }}
      />

      {/* Hidden image for reference */}
      <Box
        component='img'
        ref={imageRef}
        onLoad={onImageLoad}
        crossOrigin='anonymous'
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
    </Paper>
  );
};
