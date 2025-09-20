import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { CameraHeader } from "./camera/components/CameraHeader";
import { CameraView } from "./camera/components/CameraView";
import { CameraControls } from "./camera/components/CameraControls";
import { useCameraCapture } from "./camera/hooks/useCameraCapture";

interface CameraCaptureProps {
  onCapture: (imageSrc: string, originalImageSrc?: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onCapture, 
  onClose, 
  onError 
}) => {
  const {
    videoRef,
    isCapturing,
    flashEnabled,
    toggleFlash,
    handleCapturePhoto,
    openCamera,
    closeCamera
  } = useCameraCapture(onCapture, onError);

  // Automatically start camera when component mounts
  useEffect(() => {
    openCamera();
    
    // Cleanup: stop camera when component unmounts
    return () => {
      closeCamera();
    };
  }, [openCamera, closeCamera]);

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: "black",
          margin: 0,
          maxHeight: "100vh",
          height: "100vh"
        }
      }}
    >
      <DialogContent sx={{ p: 0, height: "100%", position: "relative" }}>
        <CameraHeader />
        
        <CameraView 
          videoRef={videoRef}
        />
        
        <CameraControls
          flashEnabled={flashEnabled}
          isCapturing={isCapturing}
          onToggleFlash={toggleFlash}
          onCapture={handleCapturePhoto}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
