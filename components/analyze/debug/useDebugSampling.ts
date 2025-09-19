import { useState, useCallback } from 'react';
import { samplePixelsAtClick, samplePesticidesAtCoordinates } from '../../../utils/imageProcessing/pixelSampling';
import { PESTICIDE_COORDINATES } from '../../../utils/constants/roiConstants';
import type { SamplingResult } from '../../../utils/imageProcessing/pixelSampling';

export function useDebugSampling() {
  const [showDebug, setShowDebug] = useState(false);
  const [samplingResults, setSamplingResults] = useState<SamplingResult[]>([]);
  const [manualClickResult, setManualClickResult] = useState<SamplingResult | null>(null);
  const [isPixelPickerMode, setIsPixelPickerMode] = useState(false);

  const toggleDebug = useCallback((show: boolean) => {
    setShowDebug(show);
  }, []);

  const performSampling = useCallback((ctx: CanvasRenderingContext2D) => {
    try {
      console.log('Debug: DEBUG SAMPLING - Canvas dimensions:', ctx.canvas.width, 'x', ctx.canvas.height);
      // NEW: Use coordinate-based sampling instead of ROI-based
      const results = samplePesticidesAtCoordinates(ctx, PESTICIDE_COORDINATES);
      setSamplingResults(results);
      return results;
    } catch (error) {
      console.error('Error performing debug sampling:', error);
      setSamplingResults([]);
      return [];
    }
  }, []);

  const clearSamplingResults = useCallback(() => {
    setSamplingResults([]);
    setManualClickResult(null);
  }, []);

  const togglePixelPickerMode = useCallback((enabled: boolean) => {
    setIsPixelPickerMode(enabled);
    if (!enabled) {
      setManualClickResult(null);
    }
  }, []);

  const handleImageClick = useCallback((
    ctx: CanvasRenderingContext2D,
    clickX: number,
    clickY: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    if (!isPixelPickerMode) return;
    
    try {
      const result = samplePixelsAtClick(ctx, clickX, clickY, canvasWidth, canvasHeight);
      setManualClickResult(result);
    } catch (error) {
      console.error('Error in manual pixel sampling:', error);
    }
  }, [isPixelPickerMode]);

  return {
    showDebug,
    samplingResults,
    manualClickResult,
    isPixelPickerMode,
    toggleDebug,
    togglePixelPickerMode,
    performSampling,
    handleImageClick,
    clearSamplingResults
  };
}
