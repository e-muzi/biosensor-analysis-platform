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

  // Simple placeholder function for compatibility
  const autoDetectTestKit = useCallback(() => {
    console.log("Auto-detection disabled - using manual alignment instead");
  }, []);

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
    stream: null, // For compatibility
    detectedBounds: null, // For compatibility
    isDetecting: false, // For compatibility
    flashEnabled,
    toggleFlash,
    handleCapturePhoto,
    handleCapture,
    detectTestKit: autoDetectTestKit,
    error: null,
    openCamera: () => startCamera(onError, () => {}),
    closeCamera: stopCamera
  };
}
