import React, { useRef, useCallback, useEffect, useState } from 'react';
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
      const bounds = detectTestKitBoundariesAdvanced(imageData);
      setDetectedBounds(bounds);
      
    } catch (error) {
      console.error('Detection error:', error);
      setDetectedBounds(null);
    } finally {
      setIsDetecting(false);
    }
  }, [isDetecting]);

  // Periodically detect test kit boundaries
  useEffect(() => {
    if (!videoRef.current) return;
    
    const interval = setInterval(detectTestKitInVideo, 1000); // Detect every second
    
    return () => clearInterval(interval);
  }, [detectTestKitInVideo]);

  const handleCapturePhoto = useCallback(async () => {
    if (!videoRef.current || isCapturing) return;

    const video = videoRef.current;
    
    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video not ready:', { width: video.videoWidth, height: video.videoHeight });
      onError('Camera not ready. Please wait a moment and try again.');
      return;
    }

    setIsCapturing(true);

    try {
      const canvas = document.createElement('canvas');
      
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onError('Could not process image.');
        setIsCapturing(false);
        return;
      }

      // Draw the full video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the original full image
      const originalDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      // Create a temporary image element for automatic cropping
      const tempImage = new Image();
      tempImage.src = originalDataUrl;
      
      await new Promise((resolve, reject) => {
        tempImage.onload = resolve;
        tempImage.onerror = reject;
      });

      // Use automatic test kit detection and cropping
      const croppedDataUrl = await cropToTestKit(tempImage);
      
      console.log('Automatic cropping completed');
      
      // Pass both original and cropped versions
      onCapture(croppedDataUrl, originalDataUrl);
      onClose();
    } catch (error) {
      console.error('Capture error:', error);
      onError('Failed to capture image. Please try again.');
      setIsCapturing(false);
    }
  }, [onCapture, onClose, onError, isCapturing]);

  const toggleFlash = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && videoTrack.getCapabilities) {
        const capabilities = videoTrack.getCapabilities();
        // Check if torch is supported (TypeScript doesn't know about this property)
        if ('torch' in capabilities) {
          setFlashEnabled(!flashEnabled);
          videoTrack.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any]
          });
        }
      }
    }
  }, [flashEnabled]);

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
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col" role="dialog" aria-modal="true" aria-labelledby="camera-title" style={{ top: '-30px' }}>
      <h2 id="camera-title" className="sr-only">Camera View</h2>
      
      {/* Header with instructions */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-70 text-white p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Position Test Kit</h3>
          <p className="text-sm text-gray-300">
            {detectedBounds ? 
              '✅ Test kit detected! Tap capture to analyze.' : 
              'Align the test kit within the frame. The app will automatically detect and crop the test kit area.'
            }
          </p>
        </div>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* Test kit overlay with detailed layout */}
        <CameraOverlays 
          detectedBounds={detectedBounds}
          videoWidth={videoRef.current?.videoWidth || 0}
          videoHeight={videoRef.current?.videoHeight || 0}
        />

        {/* Detection status indicator */}
        {isDetecting && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-blue-900 bg-opacity-80 text-blue-200 px-3 py-1 rounded-full text-sm">
            🔍 Detecting test kit...
          </div>
        )}
      </div>
      
      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Flash toggle */}
          <button
            onClick={toggleFlash}
            className="p-3 rounded-full bg-gray-800 bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
            title="Toggle Flash"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>

          {/* Capture button */}
          <AppButton 
            onClick={handleCapturePhoto}
            disabled={isCapturing}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              detectedBounds 
                ? 'bg-green-500 hover:bg-green-600 disabled:bg-gray-600' 
                : 'bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600'
            }`}
          >
            {isCapturing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-8 h-8 bg-white rounded-full"></div>
            )}
          </AppButton>

          {/* Cancel button */}
          <AppButton 
            onClick={onClose} 
            variant="secondary"
            className="p-3 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </AppButton>
        </div>
      </div>
    </div>
  );
}; 