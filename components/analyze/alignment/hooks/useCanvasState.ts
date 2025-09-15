import { useRef, useState } from "react";

export interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Canvas Refs
export function useCanvasRefs() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return {
    canvasRef,
    imageRef,
    containerRef
  };
}

export function useCanvasState() {
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [cropBounds, setCropBounds] = useState<CropBounds | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [imageDisplaySize, setImageDisplaySize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  return {
    isDragging,
    setIsDragging,
    isPanning,
    setIsPanning,
    cropBounds,
    setCropBounds,
    imageLoaded,
    setImageLoaded,
    dragStart,
    setDragStart,
    panStart,
    setPanStart,
    isAutoDetecting,
    setIsAutoDetecting,
    imageDisplaySize,
    setImageDisplaySize
  };
}
