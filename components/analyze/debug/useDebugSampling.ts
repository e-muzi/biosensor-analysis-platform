import { useState, useCallback } from 'react';
import { sampleAllPesticidePixels, samplePixelsAtClick } from '../../../utils/imageProcessing/pixelSampling';
import { PESTICIDE_CENTER_POINTS } from '../../../utils/constants/roiConstants';
import type { SamplingResult } from '../../../utils/imageProcessing/pixelSampling';

export function useDebugSampling() {
  const [showDebug, setShowDebug] = useState(false);
  const [samplingResults, setSamplingResults] = useState<SamplingResult[]>([]);
  const [manualClickResult, setManualClickResult] = useState<SamplingResult | null>(null);
  const [isPixelPickerMode, setIsPixelPickerMode] = useState(false);

  const toggleDebug = useCallback((show: boolean) => {
    console.log('Debug: Toggling debug mode to', show);
    setShowDebug(show);
  }, []);

  const performSampling = useCallback((ctx: CanvasRenderingContext2D) => {
    try {
      console.log('Debug: Starting sampling with center points', PESTICIDE_CENTER_POINTS);
      const results = sampleAllPesticidePixels(ctx, PESTICIDE_CENTER_POINTS);
      console.log('Debug: Sampling completed, results:', results);
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
      console.log('Debug: Manual pixel click at', clickX, clickY);
      const result = samplePixelsAtClick(ctx, clickX, clickY, canvasWidth, canvasHeight);
      setManualClickResult(result);
      console.log('Debug: Manual click result', result);
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
