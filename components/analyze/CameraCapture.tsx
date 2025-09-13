import React, { useRef, useCallback, useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  IconButton, 
  Fab,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  FlashOn as FlashOnIcon,
  FlashOff as FlashOffIcon,
  Close as CloseIcon,
  CameraAlt as CameraAltIcon
} from '@mui/icons-material';
import { AppButton } from '../shared';
import { cropToTestKit, detectTestKitBoundariesAdvanced } from '../../utils/analysis';
import { CameraOverlays } from './camera/Overlays';

interface CameraCaptureProps {
  onCapture: (imageSrc: string, originalImageSrc?: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [detectedBounds, setDetectedBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
  }, []);

  // Function to detect test kit boundaries in real-time
  const detectTestKitInVideo = useCallback(async () => {
    if (!videoRef.current || isDetecting) return;
    
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    
    setIsDetecting(true);
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Draw current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Detect test kit boundaries
      const bounds = await detectTestKitBoundariesAdvanced(imageData);
      setDetectedBounds(bounds);
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  }, [isDetecting]);

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleCapturePhoto = useCallback(async () => {
    if (!videoRef.current || isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Draw current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get original image data
      const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const originalImageSrc = canvas.toDataURL('image/jpeg', 0.9);
      
      // Crop to test kit if bounds are detected
      let finalImageSrc = originalImageSrc;
      if (detectedBounds) {
        // Create a new canvas for cropping
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = detectedBounds.width;
        croppedCanvas.height = detectedBounds.height;
        const croppedCtx = croppedCanvas.getContext('2d');
        
        if (croppedCtx) {
          // Create a temporary canvas to hold the original image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            // Draw the original image to temp canvas
            tempCtx.putImageData(originalImageData, 0, 0);
            
            // Draw the cropped portion to the final canvas
            croppedCtx.drawImage(
              tempCanvas,
              detectedBounds.x, detectedBounds.y, detectedBounds.width, detectedBounds.height,
              0, 0, detectedBounds.width, detectedBounds.height
            );
            
            finalImageSrc = croppedCanvas.toDataURL('image/jpeg', 0.9);
          }
        }
      }      
      onCapture(finalImageSrc, originalImageSrc);
    } catch (error) {
      console.error('Capture error:', error);
      onError('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, detectedBounds, onCapture, onError]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Error accessing camera: ", err);
        let message = 'Could not access camera.';
        if (err instanceof Error && err.name === 'NotAllowedError') {
          message = 'Camera permission was denied. Please allow camera access in your browser settings.';
        }
        onError(message);
        onClose();
      }
    };

    startCamera();
    
    return () => {
      stopCamera();
    };
  }, [stopCamera, onError, onClose]);

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: 'black',
          margin: 0,
          maxHeight: '100vh',
          height: '100vh'
        }
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', position: 'relative' }}>
        {/* Header with instructions */}
        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            p: 2,
            borderRadius: 0
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Position Test Kit
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {detectedBounds ? 
                '✅ Test kit detected! Tap capture to analyze.' : 
                'Align the test kit within the frame. The app will automatically detect and crop the test kit area.'
              }
            </Typography>
          </Box>
        </Paper>

        {/* Camera view */}
        <Box sx={{ flex: 1, position: 'relative', height: '100%' }}>
          <Box
            component="video"
            ref={videoRef}
            autoPlay
            playsInline
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {/* Test kit overlay with detailed layout */}
          <CameraOverlays 
            detectedBounds={detectedBounds}
            videoWidth={videoRef.current?.videoWidth || 0}
            videoHeight={videoRef.current?.videoHeight || 0}
          />

          {/* Detection status indicator */}
          {isDetecting && (
            <Chip
              label="🔍 Detecting test kit..."
              sx={{
                position: 'absolute',
                top: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(25, 118, 210, 0.8)',
                color: 'white',
                zIndex: 5
              }}
            />
          )}
        </Box>
        
        {/* Bottom controls */}
        <Paper
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 'md', mx: 'auto' }}>
            {/* Flash toggle */}
            <IconButton
              onClick={toggleFlash}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {flashEnabled ? <FlashOnIcon /> : <FlashOffIcon />}
            </IconButton>

            {/* Capture button */}
            <Fab
              onClick={handleCapturePhoto}
              disabled={isCapturing}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: detectedBounds ? 'success.main' : 'primary.main',
                '&:hover': {
                  backgroundColor: detectedBounds ? 'success.dark' : 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey.600',
                }
              }}
            >
              {isCapturing ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <CameraAltIcon sx={{ fontSize: 32, color: 'white' }} />
              )}
            </Fab>

            {/* Cancel button */}
            <IconButton
              onClick={onClose}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};
