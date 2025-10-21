import React, { useEffect } from 'react';
import {
  Box,
  Paper,
} from '@mui/material';
import { CropOverlay } from '../CropOverlay';
import { MovableDots } from './MovableDots';
import { iGEMColors } from '../../../../state/themeStore';
import type { DotPosition, MovableDot } from '../hooks/useMovableDots';

interface AlignmentCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  imageSrc: string;
  imageDisplaySize: { width: number; height: number };
  cropBounds: { x: number; y: number; width: number; height: number } | null;
  imageLoaded: boolean;
  colors: { surface: string; border: string };
  dots: MovableDot[];
  onDotMove: (dotName: string, position: DotPosition) => void;
  onResetDots: () => void;
  onImageLoad: () => void;
}

export const AlignmentCanvas: React.FC<AlignmentCanvasProps> = ({
  canvasRef,
  imageRef,
  imageSrc,
  imageDisplaySize,
  cropBounds,
  imageLoaded,
  colors,
  dots,
  onDotMove,
  onResetDots,
  onImageLoad,
}) => {
  // Draw the image on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !image.complete || !imageLoaded) return;

    const ctx = canvas.getContext('2d', {
      premultipliedAlpha: false,
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    if (!ctx) return;

    // Set canvas size to match display size
    canvas.width = imageDisplaySize.width;
    canvas.height = imageDisplaySize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    ctx.drawImage(
      image,
      0,
      0,
      imageDisplaySize.width,
      imageDisplaySize.height
    );
  }, [imageSrc, imageDisplaySize, imageLoaded, canvasRef, imageRef]);
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
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: 'default',
          position: 'relative',
          zIndex: 0,
          pointerEvents: 'none', // Disable image movement
        }}
      />


      {/* Movable dots overlay */}
      {imageLoaded && canvasRef.current && (
        <MovableDots
          dots={dots}
          canvasWidth={canvasRef.current.width}
          canvasHeight={canvasRef.current.height}
          onDotMove={onDotMove}
          onReset={onResetDots}
        />
      )}

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
