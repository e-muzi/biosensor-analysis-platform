/**
 * Main pixel sampling module - refactored for better organization
 * 
 * This module provides a clean interface for pixel sampling operations
 * while delegating specific functionality to specialized modules.
 */

// Re-export types for backward compatibility
export type { PixelData, SamplingResult, PixelWithPriority } from './types';

// Re-export main sampling functions
export { 
  sampleFivePixels, 
  sampleEdgePesticide, 
  samplePixelsAtClick,
  sampleFullROI,
  samplePixelsAtCoordinates 
} from './samplingAlgorithms';

// Re-export ROI detection functions
export { detectAndAdjustROI } from './roiDetection';

// Re-export brightness calculation functions
export { 
  calculateLuminance, 
  calculateMaxRGB,
  calculateAverageRGB,
  rgbToHsv_V,
  calculateBrightnessForRoi 
} from './brightness';

// Re-export validation functions
export { 
  isValidPixel, 
  isValidPixelForManualClick, 
  getPixelPriority,
  validatePixelData 
} from './pixelValidation';

import { sampleFivePixels, sampleEdgePesticide, samplePixelsAtCoordinates } from './samplingAlgorithms';
import { detectAndAdjustROI } from './roiDetection';
import type { SamplingResult } from './types';

/**
 * Sample all pesticide center points with dynamic ROI adjustment
 * This is the main entry point for sampling all pesticides in an image
 */
export function sampleAllPesticidePixels(
  ctx: CanvasRenderingContext2D,
  centerPoints: Array<{ name: string; roi: { x: number; y: number; width: number; height: number } }>
): SamplingResult[] {
  return centerPoints.map(centerPoint => {
    // Use special edge sampling for Acephate and Atrazine
    if (centerPoint.name === 'Acephate' || centerPoint.name === 'Atrazine') {
      return sampleEdgePesticide(ctx, centerPoint.roi.x, centerPoint.roi.y, centerPoint.name);
    }
    
    // First, try to detect and adjust the ROI dynamically for other pesticides
    const adjustedROI = detectAndAdjustROI(ctx, centerPoint.roi.x, centerPoint.roi.y, centerPoint.name);
    
    // Use the adjusted coordinates for sampling
    return sampleFivePixels(ctx, adjustedROI.x, adjustedROI.y, centerPoint.name);
  });
}

/**
 * NEW: Sample pesticides using specific pixel coordinates
 * This replaces the ROI-based detection with direct coordinate sampling
 */
export function samplePesticidesAtCoordinates(
  ctx: CanvasRenderingContext2D,
  coordinates: Array<{ name: string; x: number; y: number }>
): SamplingResult[] {
  return samplePixelsAtCoordinates(ctx, coordinates);
}
