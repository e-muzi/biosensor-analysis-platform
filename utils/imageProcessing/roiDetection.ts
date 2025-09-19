/**
 * ROI detection and adjustment utilities
 */

/**
 * Dynamic ROI detection and adjustment
 * Searches around the original center point to find the best location with most valid pixels
 */
export function detectAndAdjustROI(
  ctx: CanvasRenderingContext2D,
  originalCenterX: number,
  originalCenterY: number,
  pesticideName: string
): { x: number; y: number; adjusted: boolean } {
  const canvas = ctx.canvas;
  
  // Convert percentage coordinates to pixel coordinates with better precision
  const pixelCenterX = Math.round(canvas.width * originalCenterX);
  const pixelCenterY = Math.round(canvas.height * originalCenterY);
  
  // Define search area around the original center (20x20 pixels)
  const searchRadius = 10;
  const searchStartX = Math.max(0, pixelCenterX - searchRadius);
  const searchStartY = Math.max(0, pixelCenterY - searchRadius);
  const searchEndX = Math.min(canvas.width, pixelCenterX + searchRadius);
  const searchEndY = Math.min(canvas.height, pixelCenterY + searchRadius);
  
  let bestCenterX = pixelCenterX;
  let bestCenterY = pixelCenterY;
  let maxValidPixels = 0;
  
  // Search in a 20x20 area for the best center point
  for (let y = searchStartY; y < searchEndY; y += 2) {
    for (let x = searchStartX; x < searchEndX; x += 2) {
      // Sample a small 3x3 area around this point
      const sampleSize = 3;
      const halfSize = Math.floor(sampleSize / 2);
      
      const startX = Math.max(0, x - halfSize);
      const startY = Math.max(0, y - halfSize);
      const endX = Math.min(canvas.width, x + halfSize);
      const endY = Math.min(canvas.height, y + halfSize);
      
      const width = endX - startX;
      const height = endY - startY;
      
      const imageData = ctx.getImageData(startX, startY, width, height);
      const data = imageData.data;
      
      let validPixels = 0;
      
      // Count valid (non-black) pixels in this area
      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const dataIndex = (py * width + px) * 4;
          const r = data[dataIndex];
          const g = data[dataIndex + 1];
          const b = data[dataIndex + 2];
          
          if (!(r === 0 && g === 0 && b === 0)) {
            validPixels++;
          }
        }
      }
      
      // Update best center if this location has more valid pixels
      if (validPixels > maxValidPixels) {
        maxValidPixels = validPixels;
        bestCenterX = x;
        bestCenterY = y;
      }
    }
  }
  
  // Convert back to percentage coordinates
  const adjustedCenterX = bestCenterX / canvas.width;
  const adjustedCenterY = bestCenterY / canvas.height;
  
  const adjusted = (bestCenterX !== pixelCenterX || bestCenterY !== pixelCenterY);
  
  
  return { x: adjustedCenterX, y: adjustedCenterY, adjusted };
}

/**
 * Validate ROI boundaries and dimensions
 */
export function validateROI(
  roi: { x: number; y: number; width: number; height: number },
  canvasWidth: number,
  canvasHeight: number
): { isValid: boolean; errorMessage?: string } {
  // Check if ROI coordinates are within valid range (0-1)
  if (roi.x < 0 || roi.x > 1 || roi.y < 0 || roi.y > 1) {
    return { isValid: false, errorMessage: "ROI coordinates must be between 0 and 1" };
  }
  
  // Check if ROI dimensions are positive
  if (roi.width <= 0 || roi.height <= 0) {
    return { isValid: false, errorMessage: "ROI width and height must be positive" };
  }
  
  // Check if ROI extends beyond canvas boundaries
  if (roi.x + roi.width > 1 || roi.y + roi.height > 1) {
    return { isValid: false, errorMessage: "ROI extends beyond canvas boundaries" };
  }
  
  // Check if ROI is too small (less than 1 pixel)
  const pixelWidth = Math.floor(canvasWidth * roi.width);
  const pixelHeight = Math.floor(canvasHeight * roi.height);
  
  if (pixelWidth < 1 || pixelHeight < 1) {
    return { isValid: false, errorMessage: "ROI is too small (less than 1 pixel)" };
  }
  
  return { isValid: true };
}

/**
 * Convert ROI from percentage coordinates to pixel coordinates
 */
export function roiToPixelCoordinates(
  roi: { x: number; y: number; width: number; height: number },
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; width: number; height: number } {
  return {
    x: Math.floor(canvasWidth * roi.x),
    y: Math.floor(canvasHeight * roi.y),
    width: Math.floor(canvasWidth * roi.width),
    height: Math.floor(canvasHeight * roi.height)
  };
}

/**
 * Convert pixel coordinates back to percentage coordinates
 */
export function pixelToROICoordinates(
  pixelCoords: { x: number; y: number; width: number; height: number },
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; width: number; height: number } {
  return {
    x: pixelCoords.x / canvasWidth,
    y: pixelCoords.y / canvasHeight,
    width: pixelCoords.width / canvasWidth,
    height: pixelCoords.height / canvasHeight
  };
}
