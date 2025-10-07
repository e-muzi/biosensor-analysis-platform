import { useCallback } from 'react';
import { CropBounds } from './useCanvasState';

export function useImageCropping(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cropBounds: CropBounds | null
) {
  const handleConfirmCrop = useCallback(async (): Promise<string | null> => {
    if (!cropBounds || !canvasRef.current) return null;
    try {
      const canvas = canvasRef.current;
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) return null;
      croppedCanvas.width = cropBounds.width;
      croppedCanvas.height = cropBounds.height;
      croppedCtx.drawImage(
        canvas,
        cropBounds.x,
        cropBounds.y,
        cropBounds.width,
        cropBounds.height,
        0,
        0,
        cropBounds.width,
        cropBounds.height
      );
      return croppedCanvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      return null;
    }
  }, [cropBounds, canvasRef]);


  return {
    handleConfirmCrop,
  };
}
