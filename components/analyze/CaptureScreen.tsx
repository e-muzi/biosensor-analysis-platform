import React, { useState, useCallback } from 'react';
import { analyzeWithCalibrationStrips } from '../../utils/analysis';
import { AppButton } from '../shared';
import { CameraCapture, ImageUpload, ImageDisplay, ImageAlignment } from './';
import type { CalibrationResult } from '../../types';

interface CaptureScreenProps {
  onAnalysisComplete: (results: CalibrationResult[], imageSrc: string) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onAnalysisComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);

  const handleImageSelect = (src: string) => {
    setImageSrc(src);
    setError(null);
    setShowAlignment(true); // Show alignment step after image selection
  };

  const handleAlignmentConfirm = (alignedImageSrc: string) => {
    setImageSrc(alignedImageSrc);
    setShowAlignment(false);
  };

  const handleAlignmentBack = () => {
    setShowAlignment(false);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageSrc) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      // Create a temporary image element to analyze
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const calibrationResults = await analyzeWithCalibrationStrips(img);
      onAnalysisComplete(calibrationResults, imageSrc);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try a different one.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageSrc, onAnalysisComplete]);
  
  const handleClearImage = () => {
    setImageSrc(null);
    setError(null);
    setShowAlignment(false);
  };

  const handleOpenCamera = () => {
    setError(null);
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCameraError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleCameraCapture = (capturedImageSrc: string) => {
    setImageSrc(capturedImageSrc);
    setIsCameraOpen(false);
    setError(null);
    setShowAlignment(true); // Show alignment step after camera capture
  };

  // Show alignment screen if image is selected and alignment is enabled
  if (showAlignment && imageSrc) {
    return (
      <ImageAlignment 
        imageSrc={imageSrc}
        onConfirm={handleAlignmentConfirm}
        onBack={handleAlignmentBack}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Capture & Analyze</h2>
      
      {isCameraOpen ? (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={handleCloseCamera}
          onError={handleCameraError}
        />
      ) : (
        <>
          <div className="w-full max-w-md">
            <ImageDisplay imageSrc={imageSrc} />
          </div>
          
          {!imageSrc && (
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <AppButton onClick={handleOpenCamera} className="flex-1">
                📷 Use Camera
              </AppButton>
              <ImageUpload onImageSelect={handleImageSelect} onOpenCamera={handleOpenCamera} />
            </div>
          )}
          
          {imageSrc && !showAlignment && (
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <AppButton onClick={handleClearImage} variant="secondary" className="flex-1">
                Clear Image
              </AppButton>
              <AppButton 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze with Calibration'}
              </AppButton>
            </div>
          )}
          
          {error && (
            <div className="w-full max-w-md p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};