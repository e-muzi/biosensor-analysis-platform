import { useCallback } from "react";
import { useCanvasRefs, useCanvasState } from "./hooks/useCanvasState";
import { useImageTransform } from "./hooks/useImageTransform";
import { useTestKitDetection } from "./hooks/useTestKitDetection";
import { useImageCropping } from "./hooks/useImageCropping";
import { useMouseEvents } from "./hooks/useMouseEvents";

export function useAlignmentCanvas(
  imageSrc: string,
  onConfirm: (alignedImageSrc: string) => void
) {
  const { canvasRef, imageRef } = useCanvasRefs();
  const {
    cropBounds,
    setCropBounds,
    isAutoDetecting,
    setIsAutoDetecting,
    imageDisplaySize
  } = useCanvasState();

  const {
    scale,
    rotation,
    imageTransform,
    setImageTransform
  } = useImageTransform();

  const { autoDetectTestKit } = useTestKitDetection(
    imageRef,
    canvasRef,
    setCropBounds,
    setIsAutoDetecting
  );

  const { handleConfirmCrop } = useImageCropping(
    imageRef,
    canvasRef,
    cropBounds
  );

  const {
    handleMouseDown: handleMouseDownBase,
    handleMouseMove: handleMouseMoveBase,
    handleMouseUp: handleMouseUpBase,
    handleTouchStart: handleTouchStartBase,
    handleTouchMove: handleTouchMoveBase,
    handleTouchEnd: handleTouchEndBase
  } = useMouseEvents(
    (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const canvasPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      setImageTransform(canvasPos);
    },
    (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const canvasPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      setImageTransform(canvasPos);
    },
    () => {},
    (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const touch = e.touches[0];
      const canvasPos = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      
      setImageTransform(canvasPos);
    },
    (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const touch = e.touches[0];
      const canvasPos = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      
      setImageTransform(canvasPos);
    },
    () => {}
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleMouseDownBase(e);
  }, [handleMouseDownBase]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMouseMoveBase(e);
  }, [handleMouseMoveBase]);

  const handleMouseUp = useCallback(() => {
    handleMouseUpBase();
  }, [handleMouseUpBase]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleTouchStartBase(e);
  }, [handleTouchStartBase]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleTouchMoveBase(e);
  }, [handleTouchMoveBase]);

  const handleTouchEnd = useCallback(() => {
    handleTouchEndBase();
  }, [handleTouchEndBase]);

  const handleConfirmCropWrapper = useCallback(async () => {
    const croppedImageSrc = await handleConfirmCrop();
    if (croppedImageSrc) {
      onConfirm(croppedImageSrc);
    }
  }, [handleConfirmCrop, onConfirm]);

  return {
    canvasRef,
    imageRef,
    imageDisplaySize,
    scale,
    rotation,
    imageTransform,
    isDetecting: isAutoDetecting,
    detectedBounds: cropBounds,
    handleScaleChange: setImageTransform,
    handleRotationChange: setImageTransform,
    handleImageTranslationChange: setImageTransform,
    handleAutoDetect: autoDetectTestKit,
    handleConfirmCrop: handleConfirmCropWrapper,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
