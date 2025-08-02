import React, { useState, useCallback } from 'react';
import { analyzeWithCalibrationStrips } from '../../utils/analysis';
import { AppButton } from '../shared';
import { CameraCapture, ImageUpload, ImageDisplay, ImageAlignment } from './';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import type { CalibrationResult } from '../../types';

interface CaptureScreenProps {
  onAnalysisComplete: (results: CalibrationResult[], imageSrc: string) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onAnalysisComplete }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);

  const handleImageSelect = (src: string) => {
    setImageSrc(src);
    setError(null);
    setIsUploadedImage(true);
    setShowAlignment(true); // Show alignment step for uploaded images
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
    setIsUploadedImage(false);
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
    setIsUploadedImage(false); // Camera images are pre-cropped, but user can choose alignment
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
    <div 
      className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header Section */}
      <div className="w-full text-center mb-6">
        <h2 
          className="text-3xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          Pesticide Analysis
        </h2>
        <p 
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Capture or upload an image of your test strip for analysis
        </p>
      </div>
      
      {isCameraOpen ? (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={handleCloseCamera}
          onError={handleCameraError}
        />
      ) : (
        <>
          {/* Image Display Section */}
          <div 
            className="w-full max-w-md p-6 rounded-xl border-2 border-dashed"
            style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.border
            }}
          >
            <ImageDisplay imageSrc={imageSrc} showROIs={false} />
            {imageSrc && !isUploadedImage && (
              <div 
                className="text-center text-sm mt-3 p-2 rounded-lg"
                style={{ 
                  backgroundColor: `${iGEMColors.primary}20`,
                  color: iGEMColors.primary 
                }}
              >
                ✅ Auto-detected and cropped test kit area
              </div>
            )}
            {imageSrc && isUploadedImage && (
              <div 
                className="text-center text-sm mt-3 p-2 rounded-lg"
                style={{ 
                  backgroundColor: `${iGEMColors.accent}20`,
                  color: iGEMColors.accentDark 
                }}
              >
                📷 Uploaded image - use alignment tool for precise cropping
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {!imageSrc && (
            <div className="w-full max-w-md space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AppButton onClick={handleOpenCamera} className="w-full">
                  📷 Use Camera
                </AppButton>
                <ImageUpload onImageSelect={handleImageSelect} onOpenCamera={handleOpenCamera} />
              </div>
              
              <div 
                className="text-center text-xs p-3 rounded-lg"
                style={{ 
                  backgroundColor: colors.surface,
                  color: colors.textSecondary,
                  border: `1px solid ${colors.border}`
                }}
              >
                💡 Tip: Ensure good lighting and a clear view of the test strip
              </div>
            </div>
          )}
          
          {imageSrc && !showAlignment && (
            <div className="w-full max-w-md space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AppButton onClick={handleClearImage} variant="outline" className="w-full">
                  Clear Image
                </AppButton>
                <AppButton 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? '🔬 Analyzing...' : '🔬 Analyze'}
                </AppButton>
              </div>
              
              {!isUploadedImage && (
                <AppButton 
                  onClick={() => setShowAlignment(true)}
                  variant="secondary"
                  className="w-full"
                >
                  🔧 Align Image (Optional)
                </AppButton>
              )}
            </div>
          )}
          
          {error && (
            <div 
              className="w-full max-w-md p-4 rounded-lg text-sm"
              style={{ 
                backgroundColor: '#DC2626',
                color: 'white',
                border: '1px solid #B91C1C'
              }}
            >
              ❌ {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};