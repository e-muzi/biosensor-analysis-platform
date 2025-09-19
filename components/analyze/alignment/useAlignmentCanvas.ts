import { useCallback, useState } from "react";
import { useCanvasRefs, useCanvasState } from "./hooks/useCanvasState";
import { useImageTransform } from "./hooks/useImageTransform";

export function useAlignmentCanvas(
  imageSrc: string,
  onConfirm: (alignedImageSrc: string) => void
) {
  const { canvasRef, imageRef } = useCanvasRefs();
  const { imageDisplaySize } = useCanvasState();

  const {
    scale,
    rotation,
    imageTransform,
    setImageTransform
  } = useImageTransform();

  // State for tracking drag operations
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Handle mouse drag for image positioning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setImageTransform(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Handle touch events for two-finger zoom and single finger drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Single touch - start drag
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Two touches - prepare for zoom
      setIsDragging(false);
      setDragStart(null);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging && dragStart) {
      // Single touch drag
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      
      setImageTransform(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Two finger zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Simple zoom based on distance change (you can make this more sophisticated)
      const zoomFactor = distance / 200; // Adjust this value as needed
      setImageTransform(prev => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, zoomFactor))
      }));
    }
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Simple confirm function - just pass the image source since we're not cropping
  const handleConfirm = useCallback(() => {
    onConfirm(imageSrc);
  }, [imageSrc, onConfirm]);

  return {
    canvasRef,
    imageRef,
    imageDisplaySize,
    scale,
    rotation,
    imageTransform,
    isDragging,
    handleConfirm,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
