import { useCallback, useRef } from "react";

// Mouse Events
export function useMouseEvents(
  onMouseDown: (e: React.MouseEvent) => void,
  onMouseMove: (e: React.MouseEvent) => void,
  onMouseUp: () => void,
  onTouchStart: (e: React.TouchEvent) => void,
  onTouchMove: (e: React.TouchEvent) => void,
  onTouchEnd: () => void
) {
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    onMouseDown(e);
  }, [onMouseDown]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    onMouseMove(e);
  }, [onMouseMove]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    onMouseUp();
  }, [onMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    const touch = e.touches[0];
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    onTouchStart(e);
  }, [onTouchStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const touch = e.touches[0];
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    onTouchMove(e);
  }, [onTouchMove]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    onTouchEnd();
  }, [onTouchEnd]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
