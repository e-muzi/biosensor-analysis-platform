import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import {
  PESTICIDE_ROIS,
  CALIBRATION_STRIPS,
  PESTICIDE_CENTER_POINTS,
} from '../../../utils/constants/roiConstants';
import { useModeStore } from '../../../state/modeStore';

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  imageSrc: string;
  scale: number;
  rotation: number;
  imageTransform: { x: number; y: number; scale?: number };
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  setLocalImageDisplaySize: (size: { width: number; height: number }) => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  canvasRef,
  imageRef,
  imageSrc,
  scale,
  rotation,
  imageTransform,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  setLocalImageDisplaySize,
}) => {
  const [localImageDisplaySize, setLocalImageDisplaySizeLocal] = useState<{
    width: number;
    height: number;
  }>({ width: 400, height: 300 });
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
      }
    };

    if (image.complete) {
      handleImageLoad();
    } else {
      image.addEventListener('load', handleImageLoad);
      return () => image.removeEventListener('load', handleImageLoad);
    }
  }, [imageSrc]);

  // Draw the image
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !image.complete) return;

    const ctx = canvas.getContext('2d', {
      premultipliedAlpha: false,
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    if (!ctx) return;

    // Set canvas size to match display size
    canvas.width = localImageDisplaySize.width;
    canvas.height = localImageDisplaySize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(imageTransform.x, imageTransform.y);
    ctx.scale(
      scale * (imageTransform.scale || 1),
      scale * (imageTransform.scale || 1)
    );
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw the image
    ctx.drawImage(
      image,
      0,
      0,
      localImageDisplaySize.width,
      localImageDisplaySize.height
    );

    // Restore context
    ctx.restore();
  }, [
    imageSrc,
    localImageDisplaySize,
    scale,
    rotation,
    imageTransform,
    isDragging,
  ]);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imageRef}
        src={imageSrc}
        style={{ display: 'none' }}
        alt='Test kit'
      />
      <Box
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
        <canvas
          ref={canvasRef}
          width={localImageDisplaySize.width}
          height={localImageDisplaySize.height}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            cursor: isDragging ? 'grabbing' : 'grab',
            position: 'relative',
            zIndex: 0,
            pointerEvents: 'auto',
          }}
        />

        {/* Calibration strips overlay - only in strip mode */}
        {detectionMode === 'strip' &&
          CALIBRATION_STRIPS.map(strip => (
            <Box
              key={strip.name}
              sx={{
                position: 'absolute',
                left: `${strip.roi.x * 100}%`,
                top: `${strip.roi.y * 100}%`,
                width: `${strip.roi.width * 100}%`,
                height: `${strip.roi.height * 100}%`,
                border: '1px solid',
                borderColor: 'primary.main',
                backgroundColor: 'transparent',
                pointerEvents: 'none',
                borderRadius: 1,
                zIndex: 1,
              }}
            />
          ))}

        {/* Pesticide test areas overlay - always show */}
        {PESTICIDE_ROIS.map(pesticide => (
          <Box
            key={pesticide.name}
            sx={{
              position: 'absolute',
              left: `${pesticide.roi.x * 100}%`,
              top: `${pesticide.roi.y * 100}%`,
              width: `${pesticide.roi.width * 100}%`,
              height: `${pesticide.roi.height * 100}%`,
              border: '1px solid',
              borderColor: 'primary.main',
              backgroundColor: 'transparent',
              pointerEvents: 'none',
              borderRadius: 1,
              zIndex: 1,
            }}
          />
        ))}

        {/* Guide dots overlay - always show */}
        {PESTICIDE_CENTER_POINTS.map(pesticide => (
          <Box key={pesticide.name}>
            {/* Guide dot positioned at the center of the green box */}
            <Box
              sx={{
                position: 'absolute',
                left: `${pesticide.roi.x * 100}%`,
                top: `${pesticide.roi.y * 100}%`,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'red',
                border: '2px solid white',
                zIndex: 15, // Higher than green boxes
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(255, 0, 0, 0.8)',
              }}
            />

            {/* Pesticide label */}
            <Box
              component='span'
              sx={{
                position: 'absolute',
                left: `${pesticide.roi.x * 100}%`,
                top: `${pesticide.roi.y * 100}%`,
                color: 'red',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                px: 0.5,
                py: 0.2,
                borderRadius: 0.5,
                fontSize: '0.6rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                zIndex: 15,
                border: '1px solid red',
                transform: 'translate(-50%, -120%)',
              }}
            >
              {pesticide.name}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
