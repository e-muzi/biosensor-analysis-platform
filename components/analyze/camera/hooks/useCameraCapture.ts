import { useCallback } from "react";
import { useCameraStream } from "./useCameraStream";
import { useImageCapture } from "./useImageCapture";

// Camera Capture
export function useCameraCapture(
  onCapture: (imageSrc: string, originalImageSrc?: string) => void,
  onError: (error: string) => void
) {
  const {
    videoRef,
    isCapturing,
    setIsCapturing,
    startCamera,
    stopCamera
  } = useCameraStream();

  const {
    flashEnabled,
    toggleFlash,
    captureImage
  } = useImageCapture();


  const handleCapturePhoto = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      await captureImage(
        videoRef.current,
        null, // detectedBounds to handle detection separately
        onCapture,
        onError,
        setIsCapturing
      );
    } catch (error) {
      console.error("Capture failed:", error);
      onError("Failed to capture image");
    }
  }, [videoRef, captureImage, onCapture, onError, setIsCapturing]);

  const handleCapture = useCallback(async () => {
    await handleCapturePhoto();
  }, [handleCapturePhoto]);

  return {
    videoRef,
    isCapturing,
    flashEnabled,
    toggleFlash,
    handleCapturePhoto,
    handleCapture,
    openCamera: () => startCamera(onError, () => {}),
    closeCamera: stopCamera
  };
}
