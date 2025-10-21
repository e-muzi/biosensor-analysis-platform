import { useCallback, useState } from 'react';
import { useCanvasRefs } from './hooks/useCanvasState';
import { useImageTransform } from './hooks/useImageTransform';
import { useMovableDots } from './hooks/useMovableDots';

export function useAlignmentCanvas(
  imageSrc: string,
  onConfirm: (alignedImageSrc: string, dotPositions: Array<{ name: string; x: number; y: number }>) => void
) {
  const { canvasRef, imageRef } = useCanvasRefs();
  // Default display size - will be updated by CanvasStage
  const [localImageDisplaySize, setLocalImageDisplaySize] = useState<{
    width: number;
    height: number;
  }>({ width: 400, height: 300 });

  const {
    scale,
    rotation,
    imageTransform,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
  } = useImageTransform();

  // Movable dots functionality
  const { dots, updateDotPosition, resetDots, getDotPositions } = useMovableDots();

  // Handle dot movement
  const handleDotMove = useCallback((dotName: string, position: { x: number; y: number }) => {
    updateDotPosition(dotName, position);
  }, [updateDotPosition]);

  // Handle dot reset
  const handleResetDots = useCallback(() => {
    resetDots();
  }, [resetDots]);

  // Apply transformations and crop to create aligned image
  const handleConfirm = useCallback(async () => {
    if (!canvasRef.current || !imageRef.current) {
      // Get current dot positions and convert to pixel coordinates
      const dotPositions = getDotPositions().map(dot => ({
        name: dot.name,
        x: Math.round(dot.roi.x * 400), // Use default canvas size if not available
        y: Math.round(dot.roi.y * 300),
      }));
      onConfirm(imageSrc, dotPositions);
      return;
    }

    try {
      const image = imageRef.current;

      // Create a new canvas for the final aligned image
      const alignedCanvas = document.createElement('canvas');
      const alignedCtx = alignedCanvas.getContext('2d', {
        premultipliedAlpha: false,
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      if (!alignedCtx) {
        const dotPositions = getDotPositions().map(dot => ({
          name: dot.name,
          x: Math.round(dot.roi.x * 400),
          y: Math.round(dot.roi.y * 300),
        }));
        onConfirm(imageSrc, dotPositions);
        return;
      }

      // Set canvas size to match the original image dimensions
      alignedCanvas.width = image.naturalWidth;
      alignedCanvas.height = image.naturalHeight;

      // Clear canvas
      alignedCtx.clearRect(0, 0, alignedCanvas.width, alignedCanvas.height);

      // Save context
      alignedCtx.save();

      // Apply the same transformations that were applied to the display canvas
      // Convert display coordinates to natural image coordinates
      const scaleX = image.naturalWidth / localImageDisplaySize.width;
      const scaleY = image.naturalHeight / localImageDisplaySize.height;

      alignedCtx.translate(
        imageTransform.x * scaleX,
        imageTransform.y * scaleY
      );
      alignedCtx.scale(scale, scale);
      alignedCtx.rotate((rotation * Math.PI) / 180);

      // Draw the image at natural size
      alignedCtx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );

      // Restore context
      alignedCtx.restore();

      // Convert to data URL
      const alignedImageSrc = alignedCanvas.toDataURL('image/jpeg', 0.9);
      
      // Get current dot positions and convert to pixel coordinates for the aligned image
      const dotPositions = getDotPositions().map(dot => ({
        name: dot.name,
        x: Math.round(dot.roi.x * image.naturalWidth),
        y: Math.round(dot.roi.y * image.naturalHeight),
      }));
      
      onConfirm(alignedImageSrc, dotPositions);
    } catch (error) {
      // Fallback to original image if transformation fails
      const dotPositions = getDotPositions().map(dot => ({
        name: dot.name,
        x: Math.round(dot.roi.x * 400),
        y: Math.round(dot.roi.y * 300),
      }));
      onConfirm(imageSrc, dotPositions);
    }
  }, [
    imageSrc,
    onConfirm,
    canvasRef,
    imageRef,
    imageTransform,
    scale,
    rotation,
    localImageDisplaySize,
    getDotPositions,
  ]);

  return {
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
  };
}
