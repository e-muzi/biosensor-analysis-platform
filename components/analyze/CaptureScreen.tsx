import React from "react";
import { Alert, Box } from "@mui/material";
import { CameraCapture, ImageAlignment } from "./";
import { CaptureHeader } from "./capture/components/CaptureHeader";
import { ImagePreview } from "./capture/components/ImagePreview";
import { CaptureActions } from "./capture/components/CaptureActions";
import { ImageActions } from "./capture/components/ImageActions";
import { useCaptureLogic } from "./capture/hooks/useCaptureLogic";
import type { CalibrationResult } from "../../types";

interface CaptureScreenProps {
  onAnalysisComplete: (results: CalibrationResult[], imageSrc: string) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onAnalysisComplete }) => {
  const {
    imageSrc,
    originalImageSrc,
    error,
    isAnalyzing,
    isCameraOpen,
    showAlignment,
    isUploadedImage,
    handleImageSelect,
    handleAlignmentConfirm,
    handleAlignmentBack,
    handleAnalyze,
    handleClearImage,
    handleOpenCamera,
    handleCloseCamera,
    handleCameraError,
    handleCameraCapture,
    setShowAlignment
  } = useCaptureLogic(onAnalysisComplete);

  // Show alignment screen if image is selected and alignment is enabled
  if (showAlignment && imageSrc) {
    return (
      <ImageAlignment 
        imageSrc={originalImageSrc || imageSrc}
        onConfirm={handleAlignmentConfirm}
        
      />
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      <CaptureHeader />
      
      {isCameraOpen ? (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={handleCloseCamera}
          onError={handleCameraError}
        />
      ) : (
        <>
          <ImagePreview 
            imageSrc={imageSrc} 
            isUploadedImage={isUploadedImage} 
          />
          
          {!imageSrc && (
            <CaptureActions 
              onOpenCamera={handleOpenCamera}
              onImageSelect={handleImageSelect}
            />
          )}
          
          {imageSrc && !showAlignment && (
            <ImageActions
              isUploadedImage={isUploadedImage}
              isAnalyzing={isAnalyzing}
              onClearImage={handleClearImage}
              onAnalyze={handleAnalyze}
              onShowAlignment={() => setShowAlignment(true)}
            />
          )}
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ maxWidth: "md", mx: "auto", mt: 2 }}
            >
              ❌ {error}
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};
