import { useState, useCallback } from 'react';
import { PESTICIDE_CENTER_POINTS } from '../../../../utils/constants/roiConstants';

export interface DotPosition {
  x: number; // percentage (0-1)
  y: number; // percentage (0-1)
}

export interface MovableDot {
  name: string;
  position: DotPosition;
}

export function useMovableDots() {
  // Initialize with default positions from constants
  const [dots, setDots] = useState<MovableDot[]>(() => 
    PESTICIDE_CENTER_POINTS.map(pesticide => ({
      name: pesticide.name,
      position: { x: pesticide.roi.x, y: pesticide.roi.y }
    }))
  );

  // Update a specific dot's position
  const updateDotPosition = useCallback((dotName: string, newPosition: DotPosition) => {
    setDots(prevDots => 
      prevDots.map(dot => 
        dot.name === dotName 
          ? { ...dot, position: newPosition }
          : dot
      )
    );
  }, []);

  // Reset all dots to default positions
  const resetDots = useCallback(() => {
    setDots(PESTICIDE_CENTER_POINTS.map(pesticide => ({
      name: pesticide.name,
      position: { x: pesticide.roi.x, y: pesticide.roi.y }
    })));
  }, []);

  // Get current dot positions for analysis
  const getDotPositions = useCallback(() => {
    return dots.map(dot => ({
      name: dot.name,
      roi: { x: dot.position.x, y: dot.position.y, width: 0, height: 0 }
    }));
  }, [dots]);

  return {
    dots,
    updateDotPosition,
    resetDots,
    getDotPositions
  };
}
