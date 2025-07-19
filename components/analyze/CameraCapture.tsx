import React, { useRef, useCallback, useEffect, useState } from 'react';
import { AppButton } from '../shared';
import { CALIBRATION_STRIPS, PESTICIDE_ROIS } from '../../utils/analysis';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
  }, []);

  const handleCapturePhoto = useCallback(() => {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onError('Could not process image.');
        setIsCapturing(false);
        return;
      }

      // Draw the full video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Calculate the test kit area bounds (covers all calibration strips and test areas)
      // Based on the analysis layout: x from 0.04 to 0.96, y from 0.15 to 0.85
      const kitX = Math.floor(canvas.width * 0.04);
      const kitY = Math.floor(canvas.height * 0.15);
      const kitWidth = Math.floor(canvas.width * 0.92); // 0.96 - 0.04
      const kitHeight = Math.floor(canvas.height * 0.7); // 0.85 - 0.15

      // Create a new canvas for the cropped test kit area
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = kitWidth;
      croppedCanvas.height = kitHeight;
      
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) {
        onError('Could not process cropped image.');
        setIsCapturing(false);
        return;
      }

      // Draw only the test kit area
      croppedCtx.drawImage(
        canvas, 
        kitX, kitY, kitWidth, kitHeight,  // Source rectangle
        0, 0, kitWidth, kitHeight          // Destination rectangle
      );

      const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.9);
      onCapture(dataUrl);
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
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col" role="dialog" aria-modal="true" aria-labelledby="camera-title">
      <h2 id="camera-title" className="sr-only">Camera View</h2>
      
      {/* Header with instructions */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-70 text-white p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Position Test Kit</h3>
          <p className="text-sm text-gray-300">Align the test kit within the frame. The app will automatically crop to the test kit area.</p>
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[90vmin] h-[60vmin] max-w-[600px] max-h-[400px]">
            {/* Main test kit border */}
            <div className="absolute inset-0 border-4 border-cyan-400 border-dashed rounded-lg">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-cyan-400 bg-gray-900 bg-opacity-80 px-3 py-1 text-sm rounded-full font-medium">
                Test Kit Area
              </div>
            </div>

            {/* Calibration strips overlay */}
            {CALIBRATION_STRIPS.map((strip, index) => (
              <div key={`cal-${strip.name}`} className="absolute">
                <div 
                  className="border-2 border-green-400 border-dashed bg-green-400 bg-opacity-10"
                  style={{ 
                    top: `${strip.roi.y * 100}%`, 
                    left: `${strip.roi.x * 100}%`, 
                    width: `${strip.roi.width * 100}%`, 
                    height: `${strip.roi.height * 100}%` 
                  }}
                >
                  <div className="absolute -top-6 left-0 text-green-400 bg-gray-900 bg-opacity-80 px-2 py-1 text-xs rounded">
                    {strip.name} Cal
                  </div>
                </div>
              </div>
            ))}

            {/* Test areas overlay */}
            {PESTICIDE_ROIS.map(({name, roi}) => (
              <div key={`test-${name}`} className="absolute">
                <div 
                  className="border-2 border-cyan-400 border-dashed bg-cyan-400 bg-opacity-10"
                  style={{ 
                    top: `${roi.y * 100}%`, 
                    left: `${roi.x * 100}%`, 
                    width: `${roi.width * 100}%`, 
                    height: `${roi.height * 100}%` 
                  }}
                >
                  <div className="absolute -top-6 left-0 text-cyan-400 bg-gray-900 bg-opacity-80 px-2 py-1 text-xs rounded">
                    {name} Test
                  </div>
                </div>
              </div>
            ))}

            {/* Corner guides */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>
          </div>
        </div>
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
            className="w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 flex items-center justify-center"
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