import { useRef, useCallback, useState } from 'react';

// Camera Stream
export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(
    async (onError: (error: string) => void, onClose: () => void) => {
      try {
        // Stop any existing stream first to prevent conflicts
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (videoRef.current) {
          // Clear any existing srcObject first
          videoRef.current.srcObject = null;
          videoRef.current.srcObject = stream;

          // Wait for the video to be ready before playing
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
            } catch (playError) {
              console.warn('Video play interrupted:', playError);
            }
          };
        }
        streamRef.current = stream;
      } catch (err) {
        console.error('Error accessing camera: ', err);
        let message = 'Could not access camera.';
        if (err instanceof Error && err.name === 'NotAllowedError') {
          message =
            'Camera permission was denied. Please allow camera access in your browser settings.';
        } else if (err instanceof Error && err.name === 'NotFoundError') {
          message = 'No camera found. Please connect a camera and try again.';
        } else if (err instanceof Error && err.name === 'NotReadableError') {
          message = 'Camera is already in use by another application.';
        }
        onError(message);
        onClose();
      }
    },
    []
  );

  return {
    videoRef,
    isCapturing,
    setIsCapturing,
    startCamera,
    stopCamera,
  };
}
