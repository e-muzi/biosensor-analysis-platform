import { useState, useRef, useCallback, useEffect } from 'react';
import { cropToTestKit, detectTestKitBoundariesAdvanced } from '../../../utils/analysis';

export interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseAlignmentCanvasResult {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  imageDisplaySize: { width: number; height: number };
  imageLoaded: boolean;
  cropBounds: CropBounds | null;
  setCropBounds: (b: CropBounds | null) => void;
  isAutoDetecting: boolean;
  isDragging: boolean;
  isPanning: boolean;
  scale: number;
  rotation: number;
  imageTransform: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  handleMouseMove: (e: React.MouseEvent | React.TouchEvent) => void;
  handleMouseUp: () => void;
  handleImageLoad: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleRotateLeft: () => void;
  handleRotateRight: () => void;
  handleResetTransform: () => void;
  handleConfirmCrop: () => Promise<string | null>;
  handleAutoCrop: () => Promise<string | null>;
}

export function useAlignmentCanvas(imageSrc: string): UseAlignmentCanvasResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [cropBounds, setCropBounds] = useState<CropBounds | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [imageDisplaySize, setImageDisplaySize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageTransform, setImageTransform] = useState({ x: 0, y: 0 });

  const redrawCanvas = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX + imageTransform.x, centerY + imageTransform.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();
  }, [scale, rotation, imageTransform]);

  const autoDetectTestKit = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current) return;
    setIsAutoDetecting(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;
      ctx.drawImage(imageRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const bounds = detectTestKitBoundariesAdvanced(imageData);
      if (bounds) {
        setCropBounds(bounds);
      } else {
        const fallbackWidth = Math.floor(canvas.width * 0.8);
        const fallbackHeight = Math.floor(canvas.height * 0.8);
        const fallbackX = Math.floor((canvas.width - fallbackWidth) / 2);
        const fallbackY = Math.floor((canvas.height - fallbackHeight) / 2);
        setCropBounds({ x: fallbackX, y: fallbackY, width: fallbackWidth, height: fallbackHeight });
      }
    } catch (error) {
      console.error('Auto-detection failed:', error);
      if (imageRef.current && canvasRef.current) {
        const fallbackWidth = Math.floor(imageRef.current.naturalWidth * 0.8);
        const fallbackHeight = Math.floor(imageRef.current.naturalHeight * 0.8);
        const fallbackX = Math.floor((imageRef.current.naturalWidth - fallbackWidth) / 2);
        const fallbackY = Math.floor((imageRef.current.naturalHeight - fallbackHeight) / 2);
        setCropBounds({ x: fallbackX, y: fallbackY, width: fallbackWidth, height: fallbackHeight });
      }
    } finally {
      setIsAutoDetecting(false);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    if (!imageRef.current || !canvasRef.current || !containerRef.current) return;
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const maxHeight = Math.min(window.innerHeight * 0.6, 500);
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    let displayWidth = containerWidth;
    let displayHeight = containerWidth / aspectRatio;
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = maxHeight * aspectRatio;
    }
    setImageDisplaySize({ width: displayWidth, height: displayHeight });
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    redrawCanvas();
    setImageLoaded(true);
    autoDetectTestKit();
  }, [autoDetectTestKit, redrawCanvas]);

  // Load the image element whenever imageSrc changes
  useEffect(() => {
    if (!imageSrc || !imageRef.current) return;
    imageRef.current.crossOrigin = 'anonymous';
    imageRef.current.src = imageSrc;
  }, [imageSrc]);

  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: Math.round((screenX - rect.left) * scaleX),
      y: Math.round((screenY - rect.top) * scaleY)
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const canvasPos = screenToCanvas(clientX, clientY);
    if (
      cropBounds &&
      canvasPos.x >= cropBounds.x && canvasPos.x <= cropBounds.x + cropBounds.width &&
      canvasPos.y >= cropBounds.y && canvasPos.y <= cropBounds.y + cropBounds.height
    ) {
      setDragStart(canvasPos);
      setIsDragging(true);
      setIsPanning(false);
      setPanStart(null);
    } else {
      setPanStart(canvasPos);
      setIsPanning(true);
      setIsDragging(false);
      setDragStart(null);
    }
  }, [cropBounds, screenToCanvas]);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const canvasPos = screenToCanvas(clientX, clientY);
    if (isPanning && panStart) {
      const deltaX = canvasPos.x - panStart.x;
      const deltaY = canvasPos.y - panStart.y;
      setImageTransform(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setPanStart(canvasPos);
      return;
    }
    if (isDragging && dragStart && cropBounds && canvasRef.current) {
      const deltaX = canvasPos.x - dragStart.x;
      const deltaY = canvasPos.y - dragStart.y;
      const newX = Math.max(0, Math.min(canvasRef.current.width - cropBounds.width, cropBounds.x + deltaX));
      const newY = Math.max(0, Math.min(canvasRef.current.height - cropBounds.height, cropBounds.y + deltaY));
      setCropBounds({ ...cropBounds, x: newX, y: newY });
      setDragStart(canvasPos);
    }
  }, [isPanning, panStart, isDragging, dragStart, cropBounds, screenToCanvas]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setDragStart(null);
    setPanStart(null);
  }, []);

  const handleZoomIn = useCallback(() => setScale(prev => Math.min(prev * 1.2, 3)), []);
  const handleZoomOut = useCallback(() => setScale(prev => Math.max(prev / 1.2, 0.5)), []);
  const handleRotateLeft = useCallback(() => setRotation(prev => prev - 90), []);
  const handleRotateRight = useCallback(() => setRotation(prev => prev + 90), []);
  const handleResetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setImageTransform({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      redrawCanvas();
    }
  }, [scale, rotation, imageTransform, imageLoaded, redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleMouseUpGlobal = () => handleMouseUp();
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (isDragging || isPanning) {
        handleMouseMove(e as any);
      }
    };
    document.addEventListener('mouseup', handleMouseUpGlobal);
    document.addEventListener('mousemove', handleMouseMoveGlobal);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpGlobal);
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
    };
  }, [isDragging, isPanning, handleMouseUp, handleMouseMove]);

  const handleConfirmCrop = useCallback(async (): Promise<string | null> => {
    if (!cropBounds || !canvasRef.current) return null;
    try {
      const canvas = canvasRef.current;
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) return null;
      croppedCanvas.width = cropBounds.width;
      croppedCanvas.height = cropBounds.height;
      croppedCtx.drawImage(
        canvas,
        cropBounds.x, cropBounds.y, cropBounds.width, cropBounds.height,
        0, 0, cropBounds.width, cropBounds.height
      );
      return croppedCanvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Crop error:', error);
      return null;
    }
  }, [cropBounds]);

  const handleAutoCrop = useCallback(async (): Promise<string | null> => {
    if (!imageRef.current) return null;
    try {
      const croppedDataUrl = await cropToTestKit(imageRef.current);
      return croppedDataUrl;
    } catch (error) {
      console.error('Auto-crop error:', error);
      return null;
    }
  }, []);

  // Expose image onLoad handler
  useEffect(() => {
    if (!imageRef.current) return;
    const imgEl = imageRef.current;
    imgEl.onload = handleImageLoad as any;
  }, [handleImageLoad]);

  return {
    canvasRef,
    imageRef,
    containerRef,
    imageDisplaySize,
    imageLoaded,
    cropBounds,
    setCropBounds,
    isAutoDetecting,
    isDragging,
    isPanning,
    scale,
    rotation,
    imageTransform,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleImageLoad,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
    handleConfirmCrop,
    handleAutoCrop,
  };
}

