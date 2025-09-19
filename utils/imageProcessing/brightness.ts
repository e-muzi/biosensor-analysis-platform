/**
 * RGB-only brightness calculation utilities
 * All calculations use RGB values directly without HSV conversion
 */

/**
 * Calculate luminance using the standard RGB formula
 * This is the most accurate representation of perceived brightness
 * @param r Red channel (0-255)
 * @param g Green channel (0-255) 
 * @param b Blue channel (0-255)
 * @returns Brightness value (0-255)
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  // Standard luminance formula: 0.299*R + 0.587*G + 0.114*B
  // These weights are based on human eye sensitivity to different colors
  return (0.299 * r) + (0.587 * g) + (0.114 * b);
}

/**
 * Calculate brightness as the maximum RGB value
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Brightness value (0-255)
 */
export function calculateMaxRGB(r: number, g: number, b: number): number {
  return Math.max(r, g, b);
}

/**
 * Calculate brightness as the average RGB value
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Brightness value (0-255)
 */
export function calculateAverageRGB(r: number, g: number, b: number): number {
  return (r + g + b) / 3;
}

/**
 * Legacy function for backward compatibility - now uses consistent luminance calculation
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Brightness value (0-255)
 */
export function rgbToHsv_V(r: number, g: number, b: number): number {
  // Use consistent luminance calculation
  return calculateLuminance(r, g, b);
}

/**
 * Calculate brightness for a given region of interest using RGB luminance
 * @param ctx Canvas rendering context
 * @param roi Region of interest
 * @param brightnessMethod Method to use for brightness calculation
 * @returns Average brightness value
 */
export function calculateBrightnessForRoi(
  ctx: CanvasRenderingContext2D, 
  roi: { x: number; y: number; width: number; height: number },
  brightnessMethod: 'luminance' | 'max' | 'average' = 'luminance'
): number {
  const canvas = ctx.canvas;
  const roiX = Math.floor(canvas.width * roi.x);
  const roiY = Math.floor(canvas.height * roi.y);
  const roiWidth = Math.floor(canvas.width * roi.width);
  const roiHeight = Math.floor(canvas.height * roi.height);
  
  if (roiWidth <= 0 || roiHeight <= 0) return 0;

  const imageData = ctx.getImageData(roiX, roiY, roiWidth, roiHeight);
  const data = imageData.data;
  
  let totalBrightness = 0;
  let validPixelCount = 0;

  // Filter out black/very dark pixels and focus on colored areas
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    let brightness: number;
    switch (brightnessMethod) {
      case 'max':
        brightness = calculateMaxRGB(r, g, b);
        break;
      case 'average':
        brightness = calculateAverageRGB(r, g, b);
        break;
      case 'luminance':
      default:
        brightness = calculateLuminance(r, g, b);
        break;
    }
    
    // Only include pixels that are not pure black and have some color
    if (brightness > 10 && (r > 5 || g > 5 || b > 5)) {
      totalBrightness += brightness;
      validPixelCount++;
    }
  }
  
  // If no valid pixels found, fall back to including all pixels
  if (validPixelCount === 0) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      let brightness: number;
      switch (brightnessMethod) {
        case 'max':
          brightness = calculateMaxRGB(r, g, b);
          break;
        case 'average':
          brightness = calculateAverageRGB(r, g, b);
          break;
        case 'luminance':
        default:
          brightness = calculateLuminance(r, g, b);
          break;
      }
      
      totalBrightness += brightness;
      validPixelCount++;
    }
  }
  
  return validPixelCount > 0 ? totalBrightness / validPixelCount : 0;
}
