import { useCallback, useState } from 'react';

export function useImageCapture() {
  const [flashEnabled, setFlashEnabled] = useState(false);

  const toggleFlash = useCallback(() => {
    setFlashEnabled(!flashEnabled);
  }, [flashEnabled]);

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

        onCapture(originalImageSrc, originalImageSrc);
      } catch (error) {
        onError(
          error instanceof Error ? error.message : 'Failed to capture image'
        );
      } finally {
        setIsCapturing(false);
      }
    },
    []
  );

  return {
    flashEnabled,
    toggleFlash,
    captureImage,
  };
}
