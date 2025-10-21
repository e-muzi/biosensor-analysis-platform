import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { iGEMColors } from '../../../../state/themeStore';
import type { DotPosition, MovableDot } from '../hooks/useMovableDots';

interface MovableDotsProps {
  dots: MovableDot[];
  canvasWidth: number;
  canvasHeight: number;
  onDotMove: (dotName: string, position: DotPosition) => void;
  onReset: () => void;
}

interface DragState {
  dotName: string;
  startX: number;
  startY: number;
  initialPosition: DotPosition;
}

export const MovableDots: React.FC<MovableDotsProps> = ({
  dots,
  canvasWidth,
  canvasHeight,
  onDotMove,
  onReset,
}) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  // Convert percentage position to pixel coordinates
  const getPixelPosition = useCallback((position: DotPosition) => {
    return {
      x: position.x * canvasWidth,
      y: position.y * canvasHeight,
    };
  }, [canvasWidth, canvasHeight]);

  // Convert pixel coordinates to percentage position
  const getPercentagePosition = useCallback((pixelX: number, pixelY: number): DotPosition => {
    return {
      x: Math.max(0, Math.min(1, pixelX / canvasWidth)),
      y: Math.max(0, Math.min(1, pixelY / canvasHeight)),
    };
  }, [canvasWidth, canvasHeight]);

  // Check if a position would cause overlap with other dots
  const wouldOverlap = useCallback((dotName: string, newPosition: DotPosition) => {
    const minDistance = 0.05; // 5% minimum distance between dots
    
    return dots.some(dot => {
      if (dot.name === dotName) return false;
      
      const distance = Math.sqrt(
        Math.pow(dot.position.x - newPosition.x, 2) + 
        Math.pow(dot.position.y - newPosition.y, 2)
      );
      
      return distance < minDistance;
    });
  }, [dots]);

  const handleMouseDown = useCallback((e: React.MouseEvent, dotName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get coordinates relative to the canvas container
    const container = e.currentTarget.closest('[data-canvas-container]') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const startX = e.clientX - containerRect.left;
    const startY = e.clientY - containerRect.top;
    
    const dot = dots.find(d => d.name === dotName);
    if (!dot) return;
    
    setDragState({
      dotName,
      startX,
      startY,
      initialPosition: dot.position,
    });
  }, [dots]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;
    
    // Get coordinates relative to the canvas container
    const container = e.currentTarget.closest('[data-canvas-container]') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;
    
    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;
    
    const initialPixelPos = getPixelPosition(dragState.initialPosition);
    const newPixelX = initialPixelPos.x + deltaX;
    const newPixelY = initialPixelPos.y + deltaY;
    
    const newPosition = getPercentagePosition(newPixelX, newPixelY);
    
    // Check constraints
    if (!wouldOverlap(dragState.dotName, newPosition)) {
      onDotMove(dragState.dotName, newPosition);
    }
  }, [dragState, getPixelPosition, getPercentagePosition, wouldOverlap, onDotMove]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent, dotName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length !== 1) return;
    
    // Get coordinates relative to the canvas container
    const container = e.currentTarget.closest('[data-canvas-container]') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const startX = e.touches[0].clientX - containerRect.left;
    const startY = e.touches[0].clientY - containerRect.top;
    
    const dot = dots.find(d => d.name === dotName);
    if (!dot) return;
    
    setDragState({
      dotName,
      startX,
      startY,
      initialPosition: dot.position,
    });
  }, [dots]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragState || e.touches.length !== 1) return;
    
    e.preventDefault();
    
    // Get coordinates relative to the canvas container
    const container = e.currentTarget.closest('[data-canvas-container]') as HTMLElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const currentX = e.touches[0].clientX - containerRect.left;
    const currentY = e.touches[0].clientY - containerRect.top;
    
    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;
    
    const initialPixelPos = getPixelPosition(dragState.initialPosition);
    const newPixelX = initialPixelPos.x + deltaX;
    const newPixelY = initialPixelPos.y + deltaY;
    
    const newPosition = getPercentagePosition(newPixelX, newPixelY);
    
    // Check constraints
    if (!wouldOverlap(dragState.dotName, newPosition)) {
      onDotMove(dragState.dotName, newPosition);
    }
  }, [dragState, getPixelPosition, getPercentagePosition, wouldOverlap, onDotMove]);

  const handleTouchEnd = useCallback(() => {
    setDragState(null);
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 20,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {dots.map((dot) => {
        const pixelPos = getPixelPosition(dot.position);
        const isDragging = dragState?.dotName === dot.name;
        const isHovered = hoveredDot === dot.name;
        
        return (
          <Box
            key={dot.name}
            sx={{
              position: 'absolute',
              left: `${pixelPos.x}px`,
              top: `${pixelPos.y}px`,
              width: isDragging || isHovered ? '12px' : '8px',
              height: isDragging || isHovered ? '12px' : '8px',
              borderRadius: '50%',
              backgroundColor: iGEMColors.primary,
              border: `2px solid white`,
              cursor: 'grab',
              transform: 'translate(-50%, -50%)',
              transition: isDragging ? 'none' : 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              pointerEvents: 'auto',
              zIndex: 21,
              '&:hover': {
                transform: 'translate(-50%, -50%) scale(1.2)',
              },
              '&:active': {
                cursor: 'grabbing',
              },
            }}
            onMouseDown={(e) => handleMouseDown(e, dot.name)}
            onTouchStart={(e) => handleTouchStart(e, dot.name)}
            onMouseEnter={() => setHoveredDot(dot.name)}
            onMouseLeave={() => setHoveredDot(null)}
            title={`${dot.name} - Drag to align`}
          />
        );
      })}
      
      {/* Reset button */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1,
          border: `1px solid ${iGEMColors.primary}`,
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: iGEMColors.primary,
          zIndex: 22,
          '&:hover': {
            backgroundColor: iGEMColors.primary,
            color: 'white',
          },
        }}
        onClick={onReset}
      >
        Reset Dots
      </Box>
    </Box>
  );
};
