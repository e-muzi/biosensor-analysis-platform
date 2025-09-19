import { calculateLuminance } from './brightness';

/**
 * Enhanced pixel validation functions for biosensor detection
 */

/**
 * Correct RGB values if they appear to be premultiplied by alpha
 * This is a fallback function in case premultiplied alpha is still causing issues
 * @param r Raw red channel value
 * @param g Raw green channel value  
 * @param b Raw blue channel value
 * @param a Alpha channel value (0-255)
 * @returns Corrected RGB values
 */
export function correctPremultipliedAlpha(r: number, g: number, b: number, a: number): { r: number; g: number; b: number } {
  // If alpha is 0, return black
  if (a === 0) {
    return { r: 0, g: 0, b: 0 };
  }
  
  // If alpha is 255 (fully opaque), values should be correct
  if (a === 255) {
    return { r, g, b };
  }
  
  // Check if values appear to be premultiplied (lower than expected for the alpha level)
  // This is a heuristic - if the values seem too low for the alpha level, try to correct them
  const alphaFactor = 255 / a;
  const correctedR = Math.min(255, Math.round(r * alphaFactor));
  const correctedG = Math.min(255, Math.round(g * alphaFactor));
  const correctedB = Math.min(255, Math.round(b * alphaFactor));
  
  // Only apply correction if the corrected values seem more reasonable
  // (i.e., if they're not extremely high)
  if (correctedR <= 255 && correctedG <= 255 && correctedB <= 255) {
    return { r: correctedR, g: correctedG, b: correctedB };
  }
  
  // Return original values if correction doesn't seem appropriate
  return { r, g, b };
}

/**
 * Standard pixel validation - filters out noise and background
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Whether pixel is valid for analysis
 */
export function isValidPixel(r: number, g: number, b: number): boolean {
  // Filter out pure black
  if (r === 0 && g === 0 && b === 0) return false;
  
  // Calculate brightness using standard luminance formula
  const brightness = calculateLuminance(r, g, b);
  
  // Filter out very dark pixels (likely noise or shadows)
  if (brightness < 5) return false;
  
  // Filter out pixels that are too close to white (likely background)
  if (brightness > 250 && r > 250 && g > 250 && b > 250) return false;
  
  // For biosensor detection, we want to capture colored pixels
  // Check if there's sufficient color variation (not just grayscale)
  const maxChannel = Math.max(r, g, b);
  const minChannel = Math.min(r, g, b);
  const colorRange = maxChannel - minChannel;
  
  // Include pixels with some color variation or sufficient brightness
  if (colorRange > 10 || brightness > 50) return true;
  
  return false;
}

/**
 * Ultra-lenient validation for manual clicking
 * Only filters out pure black pixels
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Whether pixel is valid for manual analysis
 */
export function isValidPixelForManualClick(r: number, g: number, b: number): boolean {
  // Only filter out pure black pixels for manual clicking
  if (r === 0 && g === 0 && b === 0) return false;
  
  // Accept any non-black pixel for manual analysis
  return true;
}

/**
 * Calculate pixel priority score based on brightness and color intensity
 * Higher priority pixels are more likely to be relevant for biosensor analysis
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Priority score (higher = more important)
 */
export function getPixelPriority(r: number, g: number, b: number): number {
  // Use true brightness calculation for priority
  const brightness = calculateLuminance(r, g, b);
  
  // Weight G and B more heavily for biosensor detection
  // Add color intensity bonus for green/blue channels
  const colorBonus = (g * 0.3) + (b * 0.2);
  
  // Add extra bonus for green pixels (common in biosensors)
  const greenBonus = g > r && g > b ? g * 0.1 : 0;
  
  return brightness + colorBonus + greenBonus;
}

/**
 * Validate pixel data integrity
 * @param pixel Pixel data to validate
 * @returns Whether pixel data is valid
 */
export function validatePixelData(pixel: { r: number; g: number; b: number; x: number; y: number }): boolean {
  return (
    pixel.r >= 0 && pixel.r <= 255 &&
    pixel.g >= 0 && pixel.g <= 255 &&
    pixel.b >= 0 && pixel.b <= 255 &&
    pixel.x >= 0 && pixel.y >= 0 &&
    Number.isFinite(pixel.r) && Number.isFinite(pixel.g) && Number.isFinite(pixel.b) &&
    Number.isFinite(pixel.x) && Number.isFinite(pixel.y)
  );
}
