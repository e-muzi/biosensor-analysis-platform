import { useCallback, useState } from "react";

// Image Capture
export function useImageCapture() {
  const [flashEnabled, setFlashEnabled] = useState(false);

  const toggleFlash = useCallback(() => {
    setFlashEnabled(!flashEnabled);
  }, [flashEnabled]);

  const captureImage = useCallback(async (
    video: HTMLVideoElement,
    detectedBounds: { x: number; y: number; width: number; height: number } | null,
    onCapture: (imageSrc: string, originalImageSrc?: string) => void,
    onError: (error: string) => void,
    setIsCapturing: (capturing: boolean) => void
  ) => {
    setIsCapturing(true);
    
    try {
      // Check if video has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error("Video stream not ready. Please wait a moment and try again.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to create canvas context");
      }
      
      // Draw current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get original image data
      const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const originalImageSrc = canvas.toDataURL("image/jpeg", 0.9);
      
      // Crop to test kit if bounds are detected
      let finalImageSrc = originalImageSrc;
      if (detectedBounds) {
        // Create a new canvas for cropping
        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = detectedBounds.width;
        croppedCanvas.height = detectedBounds.height;
        
        const croppedCtx = croppedCanvas.getContext("2d");
        if (croppedCtx) {
          croppedCtx.drawImage(
            canvas,
            detectedBounds.x,
            detectedBounds.y,
            detectedBounds.width,
            detectedBounds.height,
            0,
            0,
            detectedBounds.width,
            detectedBounds.height
          );
          finalImageSrc = croppedCanvas.toDataURL("image/jpeg", 0.9);
        }
      }
      
      onCapture(finalImageSrc, originalImageSrc);
    } catch (error) {
      console.error("Image capture error:", error);
      onError(error instanceof Error ? error.message : "Failed to capture image");
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return {
    flashEnabled,
    toggleFlash,
    captureImage
  };
}
