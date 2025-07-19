import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppButton } from '../shared';
import { cropToTestKit, detectTestKitBoundariesAdvanced } from '../../utils/analysis';

interface ImageAlignmentProps {
  imageSrc: string;
  onConfirm: (alignedImageSrc: string) => void;
  onBack: () => void;
}

export const ImageAlignment: React.FC<ImageAlignmentProps> = ({ imageSrc, onConfirm, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropBounds, setCropBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);

  // Auto-detect test kit boundaries when image loads
  const autoDetectTestKit = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    setIsAutoDetecting(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas size to match image
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;
      
      // Draw image to canvas
      ctx.drawImage(imageRef.current, 0, 0);
      
      // Get image data for detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Detect test kit boundaries
      const bounds = detectTestKitBoundariesAdvanced(imageData);
      
      if (bounds) {
        setCropBounds(bounds);
      } else {
        // Fallback to center crop
        const fallbackWidth = Math.floor(canvas.width * 0.8);
        const fallbackHeight = Math.floor(canvas.height * 0.8);
        const fallbackX = Math.floor((canvas.width - fallbackWidth) / 2);
        const fallbackY = Math.floor((canvas.height - fallbackHeight) / 2);
        
        setCropBounds({
          x: fallbackX,
          y: fallbackY,
          width: fallbackWidth,
          height: fallbackHeight
        });
      }
    } catch (error) {
      console.error('Auto-detection failed:', error);
      // Set default crop bounds
      if (imageRef.current && canvasRef.current) {
        const fallbackWidth = Math.floor(imageRef.current.naturalWidth * 0.8);
        const fallbackHeight = Math.floor(imageRef.current.naturalHeight * 0.8);
        const fallbackX = Math.floor((imageRef.current.naturalWidth - fallbackWidth) / 2);
        const fallbackY = Math.floor((imageRef.current.naturalHeight - fallbackHeight) / 2);
        
        setCropBounds({
          x: fallbackX,
          y: fallbackY,
          width: fallbackWidth,
          height: fallbackHeight
        });
      }
    } finally {
      setIsAutoDetecting(false);
    }
  }, []);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    autoDetectTestKit();
  }, [autoDetectTestKit]);

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    return {
      x: (screenX - rect.left) * scaleX,
      y: (screenY - rect.top) * scaleY
    };
  }, []);

  // Handle mouse/touch events for manual cropping
  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!cropBounds) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const canvasPos = screenToCanvas(clientX, clientY);
    setDragStart(canvasPos);
    setIsDragging(true);
  }, [cropBounds, screenToCanvas]);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragStart || !cropBounds || !canvasRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const canvasPos = screenToCanvas(clientX, clientY);
    const deltaX = canvasPos.x - dragStart.x;
    const deltaY = canvasPos.y - dragStart.y;
    
    const newX = Math.max(0, Math.min(canvasRef.current.width - cropBounds.width, cropBounds.x + deltaX));
    const newY = Math.max(0, Math.min(canvasRef.current.height - cropBounds.height, cropBounds.y + deltaY));
    
    setCropBounds({
      ...cropBounds,
      x: newX,
      y: newY
    });
    
    setDragStart(canvasPos);
  }, [isDragging, dragStart, cropBounds, screenToCanvas]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Handle crop confirmation
  const handleConfirmCrop = useCallback(async () => {
    if (!cropBounds || !canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      
      if (!croppedCtx) return;
      
      croppedCanvas.width = cropBounds.width;
      croppedCanvas.height = cropBounds.height;
      
      // Draw the cropped area
      croppedCtx.drawImage(
        canvas,
        cropBounds.x, cropBounds.y, cropBounds.width, cropBounds.height,
        0, 0, cropBounds.width, cropBounds.height
      );
      
      const croppedDataUrl = croppedCanvas.toDataURL('image/jpeg', 0.9);
      onConfirm(croppedDataUrl);
      
    } catch (error) {
      console.error('Crop error:', error);
    }
  }, [cropBounds, onConfirm]);

  // Handle auto-crop (use the improved cropToTestKit function)
  const handleAutoCrop = useCallback(async () => {
    if (!imageRef.current) return;
    
    try {
      const croppedDataUrl = await cropToTestKit(imageRef.current);
      onConfirm(croppedDataUrl);
    } catch (error) {
      console.error('Auto-crop error:', error);
    }
  }, [onConfirm]);

  // Add event listeners for mouse/touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseUpGlobal = () => handleMouseUp();
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e as any);
      }
    };
    
    document.addEventListener('mouseup', handleMouseUpGlobal);
    document.addEventListener('mousemove', handleMouseMoveGlobal);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUpGlobal);
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
    };
  }, [isDragging, handleMouseUp, handleMouseMove]);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Align & Crop Test Kit</h2>
      
      <div className="w-full max-w-2xl">
        <div className="relative border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-900">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[60vh] cursor-move"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
          />
          
          {/* Hidden image for reference */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Test kit"
            className="hidden"
            onLoad={handleImageLoad}
          />
          
          {/* Crop overlay */}
          {cropBounds && imageLoaded && (
            <div
              className="absolute border-2 border-cyan-400 bg-cyan-400 bg-opacity-20 pointer-events-none"
              style={{
                left: `${(cropBounds.x / (canvasRef.current?.width || 1)) * 100}%`,
                top: `${(cropBounds.y / (canvasRef.current?.height || 1)) * 100}%`,
                width: `${(cropBounds.width / (canvasRef.current?.width || 1)) * 100}%`,
                height: `${(cropBounds.height / (canvasRef.current?.height || 1)) * 100}%`
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-cyan-400 bg-gray-900 bg-opacity-80 px-3 py-1 text-sm rounded-full font-medium">
                Test Kit Area
              </div>
            </div>
          )}
          
          {/* Loading indicator */}
          {isAutoDetecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-center">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Detecting test kit...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          {isDragging ? 
            'Drag to adjust the crop area' : 
            'Drag the highlighted area to adjust the test kit boundaries'
          }
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <AppButton onClick={onBack} variant="secondary" className="flex-1">
          ← Back
        </AppButton>
        <AppButton 
          onClick={handleAutoCrop} 
          disabled={!imageLoaded}
          variant="secondary"
          className="flex-1"
        >
          🔄 Auto-Crop
        </AppButton>
        <AppButton 
          onClick={handleConfirmCrop} 
          disabled={!cropBounds || !imageLoaded}
          className="flex-1"
        >
          ✅ Confirm Crop
        </AppButton>
      </div>
      
      <div className="text-center text-sm text-gray-500 max-w-md">
        <p className="mb-2">
          <strong>Manual Alignment:</strong> Drag the highlighted area to precisely crop the test kit.
        </p>
        <p>
          <strong>Auto-Crop:</strong> Use the improved detection algorithm to automatically crop the test kit area.
        </p>
      </div>
    </div>
  );
}; 