import { useState, useCallback } from 'react';
import { analyzeImage } from '../../../../utils/analysis/unifiedAnalysis';
import { useModeStore } from '../../../../state/modeStore';
import type { CalibrationResult } from '../../../../types';

export function useCaptureLogic(
  onAnalysisComplete: (results: CalibrationResult[], imageSrc: string) => void,
  onImageCapture?: (imageSrc: string) => void,
  onImageClear?: () => void,
  pendingImage?: string | null
) {
  // Use pendingImage from props instead of internal state when available
  const [internalImageSrc, setInternalImageSrc] = useState<string | null>(null);
  const imageSrc = pendingImage || internalImageSrc;

  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);

  const { detectionMode } = useModeStore();

  const handleImageSelect = useCallback(
    (src: string) => {
      if (onImageCapture) {
        onImageCapture(src);
      } else {
        setInternalImageSrc(src);
      }
      setOriginalImageSrc(src);
      setError(null);
      setIsUploadedImage(true);
      setShowAlignment(false); // Don't automatically show alignment, let user choose
    },
    [onImageCapture]
  );

  const handleAlignmentConfirm = useCallback(
    (alignedImageSrc: string) => {
      if (onImageCapture) {
        onImageCapture(alignedImageSrc);
      } else {
        setInternalImageSrc(alignedImageSrc);
      }
      setShowAlignment(false);
    },
    [onImageCapture]
  );

  const handleAlignmentBack = useCallback(() => {
    setShowAlignment(false);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageSrc) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const { calibrationResults } = await analyzeImage(img, detectionMode, !isUploadedImage);

      // For backward compatibility, we still pass CalibrationResult[] to onAnalysisComplete
      // Both preset and strip modes return CalibrationResult objects
      if (calibrationResults) {
        onAnalysisComplete(calibrationResults, imageSrc);
      } else {
        // This should not happen in the new system as both modes return CalibrationResult[]
        onAnalysisComplete([], imageSrc);
      }
    } catch (err) {
      setError('Failed to analyze image. Please try a different one.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageSrc, detectionMode, onAnalysisComplete]);

  const handleClearImage = useCallback(() => {
    if (onImageClear) {
      onImageClear();
    } else {
      setInternalImageSrc(null);
    }
    setOriginalImageSrc(null);
    setError(null);
    setShowAlignment(false);
    setIsUploadedImage(false);
  }, [onImageClear]);

  const handleOpenCamera = useCallback(() => {
    setError(null);
    setIsCameraOpen(true);
  }, []);

  const handleCloseCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const handleCameraError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const handleCameraCapture = useCallback(
    (capturedImageSrc: string, originalImageSrc?: string) => {
      if (onImageCapture) {
        onImageCapture(capturedImageSrc);
      } else {
        setInternalImageSrc(capturedImageSrc);
      }
      setOriginalImageSrc(originalImageSrc || capturedImageSrc);
      setIsCameraOpen(false);
      setError(null);
      setIsUploadedImage(false);
      setShowAlignment(false);
    },
    [onImageCapture]
  );

  return {
    imageSrc,
    originalImageSrc,
    error,
    isAnalyzing,
    isCameraOpen,
    showAlignment,
    isUploadedImage,
    detectionMode, // Expose current mode
    handleImageSelect,
    handleAlignmentConfirm,
    handleAlignmentBack,
    handleAnalyze,
    handleClearImage,
    handleOpenCamera,
    handleCloseCamera,
    handleCameraError,
    handleCameraCapture,
    setShowAlignment,
  };
}
