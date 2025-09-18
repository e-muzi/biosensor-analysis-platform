import { useState, useCallback } from 'react';
import { sampleAllPesticidePixels } from '../../../utils/imageProcessing/pixelSampling';
import { PESTICIDE_CENTER_POINTS } from '../../../utils/constants/roiConstants';
import type { SamplingResult } from '../../../utils/imageProcessing/pixelSampling';

export function useDebugSampling() {
  const [showDebug, setShowDebug] = useState(false);
  const [samplingResults, setSamplingResults] = useState<SamplingResult[]>([]);

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
  }, []);

  return {
    showDebug,
    samplingResults,
    toggleDebug,
    performSampling,
    clearSamplingResults
  };
}
