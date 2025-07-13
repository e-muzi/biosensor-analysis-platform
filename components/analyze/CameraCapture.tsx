import React, { useRef, useCallback, useEffect } from 'react';
import { AppButton } from '../shared';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
  }, []);

  const handleCapturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onError('Could not process image.');
      onClose();
      return;
    }
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    onCapture(dataUrl);
    onClose();
  }, [onCapture, onClose, onError]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
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
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="camera-title">
      <h2 id="camera-title" className="sr-only">Camera View</h2>
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain"></video>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] h-[60vmin] pointer-events-none">
        {/* Single border around the entire test kit - no individual pesticide borders */}
        <div className="absolute border-4 border-cyan-400 border-dashed w-full h-full">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-cyan-400 bg-gray-900 bg-opacity-70 px-2 py-1 text-sm rounded">
            Test Kit Area
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-center space-x-4">
        <AppButton onClick={handleCapturePhoto}>
          Capture Photo
        </AppButton>
        <AppButton onClick={onClose} variant="secondary">
          Cancel
        </AppButton>
      </div>
    </div>
  );
}; 