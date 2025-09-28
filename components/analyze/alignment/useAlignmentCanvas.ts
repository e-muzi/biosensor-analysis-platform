import { useCallback, useState } from 'react';
import { useCanvasRefs } from './hooks/useCanvasState';
import { useImageTransform } from './hooks/useImageTransform';

export function useAlignmentCanvas(
  imageSrc: string,
  onConfirm: (alignedImageSrc: string) => void
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
    setImageTransform,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
  } = useImageTransform();

  // State for tracking drag operations
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  // Handle mouse drag for image positioning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !dragStart) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setImageTransform(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Handle touch events for two-finger zoom and single finger drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start drag
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Two touches - prepare for zoom
      setIsDragging(false);
      setDragStart(null);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging && dragStart) {
        // Single touch drag
        const deltaX = e.touches[0].clientX - dragStart.x;
        const deltaY = e.touches[0].clientY - dragStart.y;

        setImageTransform(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));

        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      } else if (e.touches.length === 2) {
        // Two finger zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        // Simple zoom based on distance change (you can make this more sophisticated)
        const zoomFactor = distance / 200; // Adjust this value as needed
        setImageTransform(prev => ({
          ...prev,
          scale: Math.max(0.5, Math.min(3, zoomFactor)),
        }));
      }
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Apply transformations and crop to create aligned image
  const handleConfirm = useCallback(async () => {
    console.log('Debug: ALIGNMENT - handleConfirm called');
    console.log('Debug: ALIGNMENT - imageTransform:', imageTransform);
    console.log('Debug: ALIGNMENT - scale:', scale);
    console.log('Debug: ALIGNMENT - rotation:', rotation);

    if (!canvasRef.current || !imageRef.current) {
      console.log('Debug: ALIGNMENT - Missing refs, using original image');
      onConfirm(imageSrc);
      return;
    }

    try {
      const image = imageRef.current;
      console.log('Debug: ALIGNMENT - Creating aligned image...');

      // Create a new canvas for the final aligned image
      const alignedCanvas = document.createElement('canvas');
      const alignedCtx = alignedCanvas.getContext('2d', {
        premultipliedAlpha: false,
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      if (!alignedCtx) {
        onConfirm(imageSrc);
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
      console.log(
        'Debug: ALIGNMENT - Aligned image created, length:',
        alignedImageSrc.length
      );
      console.log('Debug: ALIGNMENT - Calling onConfirm with aligned image');
      onConfirm(alignedImageSrc);
    } catch (error) {
      console.error('Error creating aligned image:', error);
      // Fallback to original image if transformation fails
      onConfirm(imageSrc);
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
  ]);

  return {
    canvasRef,
    imageRef,
    scale,
    rotation,
    imageTransform,
    isDragging,
    handleConfirm,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
    setLocalImageDisplaySize,
  };
}
