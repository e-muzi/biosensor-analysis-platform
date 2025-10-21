import { useCallback, useState } from 'react';
import { useModeStore } from '../../../../state/modeStore';

export function useImageCapture() {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const { detectionMode } = useModeStore();

  const toggleFlash = useCallback(() => {
    setFlashEnabled(!flashEnabled);
  }, [flashEnabled]);

  // Calculate crop area for strip mode (same dimensions as StripModeBorder)
  const getStripModeCropArea = useCallback((videoWidth: number, videoHeight: number) => {
    const borderAspectRatio = 1.4; // Width:Height ratio for A4 landscape
    const borderHeightPercent = 0.8; // 80% of video height for portrait (rotated)
    const borderWidthPercent = 0.75; // 75% of video width to fit all pesticides
    
    const leftPercent = (1 - borderWidthPercent) / 2;
    const topPercent = (1 - borderHeightPercent) / 2;
    
    return {
      x: Math.round(leftPercent * videoWidth),
      y: Math.round(topPercent * videoHeight),
      width: Math.round(borderWidthPercent * videoWidth),
      height: Math.round(borderHeightPercent * videoHeight),
    };
  }, []);

  const captureImage = useCallback(
    async (
      video: HTMLVideoElement,
      onCapture: (imageSrc: string, originalImageSrc?: string) => void,
      onError: (error: string) => void,
      setIsCapturing: (capturing: boolean) => void
    ) => {
      setIsCapturing(true);

      try {
        // Check if video has valid dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          throw new Error(
            'Video stream not ready. Please wait a moment and try again.'
          );
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to create canvas context');
        }

        // Draw current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get original image data
        const originalImageSrc = canvas.toDataURL('image/jpeg', 0.9);

        // For strip mode, crop the image to the border area
        if (detectionMode === 'strip') {
          const cropArea = getStripModeCropArea(canvas.width, canvas.height);
          
          // Create a new canvas for the cropped image
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = cropArea.width;
          croppedCanvas.height = cropArea.height;
          
          const croppedCtx = croppedCanvas.getContext('2d');
          if (!croppedCtx) {
            throw new Error('Failed to create cropped canvas context');
          }
          
          // Draw the cropped portion
          croppedCtx.drawImage(
            canvas,
            cropArea.x, cropArea.y, cropArea.width, cropArea.height,
            0, 0, cropArea.width, cropArea.height
          );
          
          const croppedImageSrc = croppedCanvas.toDataURL('image/jpeg', 0.9);
          onCapture(croppedImageSrc, originalImageSrc);
        } else {
          // For preset mode, use the full image
          onCapture(originalImageSrc, originalImageSrc);
        }
      } catch (error) {
        onError(
          error instanceof Error ? error.message : 'Failed to capture image'
        );
      } finally {
        setIsCapturing(false);
      }
    },
    [detectionMode, getStripModeCropArea]
  );

  return {
    flashEnabled,
    toggleFlash,
    captureImage,
  };
}
