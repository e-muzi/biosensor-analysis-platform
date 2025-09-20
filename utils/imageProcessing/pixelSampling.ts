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
  samplePixelsAtClick,
  samplePixelsAtCoordinates 
} from './samplingAlgorithms';


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

import { samplePixelsAtCoordinates } from './samplingAlgorithms';
import type { SamplingResult } from './types';


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
