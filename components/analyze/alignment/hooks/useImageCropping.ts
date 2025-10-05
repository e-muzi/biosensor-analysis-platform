import { useCallback } from 'react';
import { cropToTestKit } from '../../../../utils/imageProcessing/imageCropping';
import { CropBounds } from './useCanvasState';

// Image Cropping
export function useImageCropping(
  imageRef: React.RefObject<HTMLImageElement>,
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
      console.error('Crop error:', error);
      return null;
    }
  }, [cropBounds, canvasRef]);

  const handleAutoCrop = useCallback(async (): Promise<string | null> => {
    if (!imageRef.current || !canvasRef.current || !cropBounds) return null;
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const croppedDataUrl = await cropToTestKit(
        imageData,
        cropBounds
      );
      return croppedDataUrl;
    } catch (error) {
      console.error('Auto-crop error:', error);
      return null;
    }
  }, [cropBounds, imageRef, canvasRef]);

  return {
    handleConfirmCrop,
    handleAutoCrop,
  };
}
