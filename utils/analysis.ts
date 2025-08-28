import { PREDEFINED_PESTICIDES } from "../state/pesticideStore";
import type { CalibrationStrip, CalibrationResult } from "../types";

// TODO: Refactor this file, it is so long (When I was writting this code, me and god can understand it. But now only god can understand it.)

// Defines a Region of Interest as a rectangle { x, y, width, height } in percentage
export interface ROI {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PesticideROI {
    name: string;
    roi: ROI;
}

// Just a Proposed layout
// After software is done, need to update it again
// Calibration strip: width = 0.06, height = 0.7
// Gap: 0.02
// Test area: width = 0.12, height = 0.7
// Group 1: cal x=0.04, test x=0.12
// Group 2: cal x=0.28, test x=0.36
// Group 3: cal x=0.52, test x=0.60
// Group 4: cal x=0.76, test x=0.84

export const CALIBRATION_STRIPS: CalibrationStrip[] = [
    {
        name: PREDEFINED_PESTICIDES[0].name, // Acephate
        roi: { x: 0.04, y: 0.15, width: 0.06, height: 0.7 },
        concentrations: [0, 25, 50, 75, 100] // µM concentrations (top to bottom)
    },
    {
        name: PREDEFINED_PESTICIDES[1].name, // Glyphosate
        roi: { x: 0.28, y: 0.15, width: 0.06, height: 0.7 },
        concentrations: [0, 50, 100, 150, 200] // µM concentrations (top to bottom)
    },
    {
        name: PREDEFINED_PESTICIDES[2].name, // Mancozeb
        roi: { x: 0.52, y: 0.15, width: 0.06, height: 0.7 },
        concentrations: [0, 30, 60, 90, 120] // µM concentrations (top to bottom)
    },
    {
        name: PREDEFINED_PESTICIDES[3].name, // Cypermethrin
        roi: { x: 0.76, y: 0.15, width: 0.06, height: 0.7 },
        concentrations: [0, 45, 90, 135, 180] // µM concentrations (top to bottom)
    }
];

export const PESTICIDE_ROIS: PesticideROI[] = [
    { name: PREDEFINED_PESTICIDES[0].name, roi: { x: 0.12, y: 0.15, width: 0.12, height: 0.7 } }, // Acephate test area
    { name: PREDEFINED_PESTICIDES[1].name, roi: { x: 0.36, y: 0.15, width: 0.12, height: 0.7 } }, // Glyphosate test area
    { name: PREDEFINED_PESTICIDES[2].name, roi: { x: 0.60, y: 0.15, width: 0.12, height: 0.7 } }, // Mancozeb test area
    { name: PREDEFINED_PESTICIDES[3].name, roi: { x: 0.84, y: 0.15, width: 0.12, height: 0.7 } }, // Cypermethrin test area
];

// Converts RGB color to HSV. Returns V (value/brightness) component.
function rgbToHsv_V(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  return max * 255; // Return V component on a 0-255 scale
}

// Calculate brightness for a given region of interest
function calculateBrightnessForRoi(ctx: CanvasRenderingContext2D, roi: ROI): number {
    const canvas = ctx.canvas;
    const roiX = Math.floor(canvas.width * roi.x);
    const roiY = Math.floor(canvas.height * roi.y);
    const roiWidth = Math.floor(canvas.width * roi.width);
    const roiHeight = Math.floor(canvas.height * roi.height);
    
    if (roiWidth <= 0 || roiHeight <= 0) return 0;

    const imageData = ctx.getImageData(roiX, roiY, roiWidth, roiHeight);
    const data = imageData.data;
    
    let totalBrightness = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const brightness = rgbToHsv_V(r, g, b);
      totalBrightness += brightness;
      pixelCount++;
    }
    
    return totalBrightness / pixelCount;
}

// Calculate brightness for each segment of a vertical calibration strip
function calculateCalibrationStripBrightnesses(ctx: CanvasRenderingContext2D, strip: CalibrationStrip): number[] {
    const canvas = ctx.canvas;
    // const stripX = Math.floor(canvas.width * strip.roi.x);
    const stripY = Math.floor(canvas.height * strip.roi.y);
    const stripWidth = Math.floor(canvas.width * strip.roi.width);
    const stripHeight = Math.floor(canvas.height * strip.roi.height);
    
    if (stripWidth <= 0 || stripHeight <= 0) return [0, 0, 0, 0, 0];

    const segmentHeight = stripHeight / 5; // 5 vertical segments in each calibration strip, can be changed due to our disaster wet lab -_-
    const brightnesses: number[] = [];

    for (let i = 0; i < 5; i++) {
        const segmentY = stripY + (i * segmentHeight);
        const segmentROI: ROI = {
            x: strip.roi.x,
            y: segmentY / canvas.height,
            width: strip.roi.width,
            height: segmentHeight / canvas.height
        };
        brightnesses.push(calculateBrightnessForRoi(ctx, segmentROI));
    }

    return brightnesses;
}

// Estimate concentration by comparing test brightness with calibration strip
// This function is not in use, but will be kept for future reference
function estimateConcentrationFromCalibration(
    testBrightness: number, 
    calibrationBrightnesses: number[], 
    concentrations: number[]
): { concentration: number; confidence: 'high' | 'medium' | 'low' } {
    
    // Find the two calibration points that bracket the test brightness
    let lowerIndex = 0;
    let upperIndex = calibrationBrightnesses.length - 1;
    
    for (let i = 0; i < calibrationBrightnesses.length - 1; i++) {
        if (testBrightness >= calibrationBrightnesses[i] && testBrightness <= calibrationBrightnesses[i + 1]) {
            lowerIndex = i;
            upperIndex = i + 1;
            break;
        }
    }
    
    // If test brightness is outside the calibration range
    if (testBrightness < calibrationBrightnesses[0]) {
        return { concentration: concentrations[0], confidence: 'low' };
    }
    if (testBrightness > calibrationBrightnesses[calibrationBrightnesses.length - 1]) {
        return { concentration: concentrations[concentrations.length - 1], confidence: 'low' };
    }
    
    // Linear interpolation
    const lowerBrightness = calibrationBrightnesses[lowerIndex];
    const upperBrightness = calibrationBrightnesses[upperIndex];
    const lowerConcentration = concentrations[lowerIndex];
    const upperConcentration = concentrations[upperIndex];
    
    if (upperBrightness === lowerBrightness) {
        return { concentration: lowerConcentration, confidence: 'medium' };
    }
    
    const concentration = lowerConcentration + 
        ((testBrightness - lowerBrightness) * (upperConcentration - lowerConcentration)) / 
        (upperBrightness - lowerBrightness);
    
    // Determine confidence based on how close we are to calibration points
    const brightnessRange = upperBrightness - lowerBrightness;
    const brightnessDiff = Math.abs(testBrightness - lowerBrightness);
    const ratio = brightnessDiff / brightnessRange;
    
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (ratio < 0.3 || ratio > 0.7) {
        confidence = 'high'; // Close to a calibration point
    } else if (ratio < 0.1 || ratio > 0.9) {
        confidence = 'low'; // Far from calibration points
    }
    
    return { concentration, confidence };
}

export function calculateMultipleBrightness(image: HTMLImageElement, rois: PesticideROI[]): Promise<{ name: string; brightness: number; }[]> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      ctx.drawImage(image, 0, 0);

      const results = rois.map(pesticideROI => {
          const brightness = calculateBrightnessForRoi(ctx, pesticideROI.roi);
          return { name: pesticideROI.name, brightness };
      });
      
      resolve(results);

    } catch (error) {
      reject(error);
    }
  });
}

// New function for calibration strip analysis
export function analyzeWithCalibrationStrips(image: HTMLImageElement): Promise<CalibrationResult[]> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      ctx.drawImage(image, 0, 0);

      const results: CalibrationResult[] = [];

      CALIBRATION_STRIPS.forEach((strip, index) => {
        // Calculate calibration strip brightnesses
        const calibrationBrightnesses = calculateCalibrationStripBrightnesses(ctx, strip);
        
        // Calculate test area brightness
        const testROI = PESTICIDE_ROIS[index];
        const testBrightness = calculateBrightnessForRoi(ctx, testROI.roi);
        
        // Estimate concentration
        const { concentration, confidence } = estimateConcentrationFromCalibration(
          testBrightness, 
          calibrationBrightnesses, 
          strip.concentrations
        );
        
        results.push({
          pesticide: strip.name,
          testBrightness,
          calibrationBrightnesses,
          estimatedConcentration: concentration,
          confidence
        });
      });
      
      resolve(results);

    } catch (error) {
      reject(error);
    }
  });
}

// Function to detect test kit boundaries by finding white background with improved edge detection
export function detectTestKitBoundaries(imageData: ImageData): { x: number; y: number; width: number; height: number } | null {
  const { data, width, height } = imageData;
  
  // Threshold for white detection (adjust as needed)
  const whiteThreshold = 180; // RGB values above this are considered white
  const minWhitePixels = 50; // Minimum consecutive white pixels to consider as border
  
  // Function to check if a pixel is white
  const isWhitePixel = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const index = (y * width + x) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    return r > whiteThreshold && g > whiteThreshold && b > whiteThreshold;
  };
  
  // Function to find the first non-white pixel from a given direction
  const findEdge = (startX: number, startY: number, direction: 'left' | 'right' | 'top' | 'bottom'): number => {
    let x = startX;
    let y = startY;
    let consecutiveWhite = 0;
    
    while (x >= 0 && x < width && y >= 0 && y < height) {
      if (isWhitePixel(x, y)) {
        consecutiveWhite++;
        if (consecutiveWhite >= minWhitePixels) {
          // We found a white border, now look for the edge
          while (x >= 0 && x < width && y >= 0 && y < height) {
            if (!isWhitePixel(x, y)) {
              // Found the edge, go back to the last white pixel
              switch (direction) {
                case 'left': return x + 1;
                case 'right': return x - 1;
                case 'top': return y + 1;
                case 'bottom': return y - 1;
              }
            }
            switch (direction) {
              case 'left': x--; break;
              case 'right': x++; break;
              case 'top': y--; break;
              case 'bottom': y++; break;
            }
          }
        }
      } else {
        consecutiveWhite = 0;
      }
      
      switch (direction) {
        case 'left': x--; break;
        case 'right': x++; break;
        case 'top': y--; break;
        case 'bottom': y++; break;
      }
    }
    
    // If we didn't find a clear edge, use the original position
    switch (direction) {
      case 'left': return 0;
      case 'right': return width - 1;
      case 'top': return 0;
      case 'bottom': return height - 1;
    }
  };
  
  // Find edges from the center outward
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  const leftEdge = findEdge(centerX, centerY, 'left');
  const rightEdge = findEdge(centerX, centerY, 'right');
  const topEdge = findEdge(centerX, centerY, 'top');
  const bottomEdge = findEdge(centerX, centerY, 'bottom');
  
  // Calculate boundaries
  const cropX = Math.max(0, leftEdge);
  const cropY = Math.max(0, topEdge);
  const cropWidth = Math.min(width - cropX, rightEdge - leftEdge);
  const cropHeight = Math.min(height - cropY, bottomEdge - topEdge);
  
  // Validate the detected area
  if (cropWidth < 50 || cropHeight < 50) {
    console.warn('Detected test kit area too small, using fallback');
    return null;
  }
  
  // Check if the detected area has a reasonable aspect ratio (test kits are typically rectangular)
  const aspectRatio = cropWidth / cropHeight;
  if (aspectRatio < 0.5 || aspectRatio > 3) {
    console.warn('Detected test kit has unusual aspect ratio, using fallback');
    return null;
  }
  
  console.log('Detected test kit boundaries:', { 
    x: cropX, y: cropY, width: cropWidth, height: cropHeight,
    aspectRatio: aspectRatio.toFixed(2)
  });
  
  return { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
}

// Alternative function using contour detection for more accurate test kit detection
export function detectTestKitBoundariesAdvanced(imageData: ImageData): { x: number; y: number; width: number; height: number } | null {
  const { data, width, height } = imageData;
  
  // Convert to grayscale and create binary mask
  const mask = new Uint8Array(width * height);
  const whiteThreshold = 180;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      
      // Create binary mask: 1 for white pixels, 0 for others
      mask[y * width + x] = (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) ? 1 : 0;
    }
  }
  
  // Find the largest connected white region (the test kit)
  const visited = new Set<number>();
  let largestRegion: number[] = [];
  
  const floodFill = (startX: number, startY: number): number[] => {
    const stack: [number, number][] = [[startX, startY]];
    const region: number[] = [];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const index = y * width + x;
      
      if (x < 0 || x >= width || y < 0 || y >= height || visited.has(index) || mask[index] === 0) {
        continue;
      }
      
      visited.add(index);
      region.push(index);
      
      // Add neighbors
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    return region;
  };
  
  // Find all connected regions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (!visited.has(index) && mask[index] === 1) {
        const region = floodFill(x, y);
        if (region.length > largestRegion.length) {
          largestRegion = region;
        }
      }
    }
  }
  
  if (largestRegion.length === 0) {
    console.warn('No white regions detected');
    return null;
  }
  
  // Calculate bounding box of the largest region
  let minX = width, maxX = 0, minY = height, maxY = 0;
  
  for (const index of largestRegion) {
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  
  // Add padding
  const padding = 5;
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropWidth = Math.min(width - cropX, maxX - minX + 2 * padding);
  const cropHeight = Math.min(height - cropY, maxY - minY + 2 * padding);
  
  console.log('Advanced detection - test kit boundaries:', { 
    x: cropX, y: cropY, width: cropWidth, height: cropHeight,
    regionSize: largestRegion.length
  });
  
  return { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
}

// Function to crop image to detected test kit area with improved detection
export function cropToTestKit(image: HTMLImageElement): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas to image size
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      
      // Draw the full image
      ctx.drawImage(image, 0, 0);
      
      // Get image data for detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Try advanced detection first, then fallback to simple detection
      let boundaries = detectTestKitBoundariesAdvanced(imageData);
      
      if (!boundaries) {
        console.log('Advanced detection failed, trying simple detection');
        boundaries = detectTestKitBoundaries(imageData);
      }
      
      if (!boundaries) {
        console.warn('Could not detect test kit, using fallback crop');
        // Fallback to center crop with reasonable test kit proportions
        const fallbackWidth = Math.floor(canvas.width * 0.85);
        const fallbackHeight = Math.floor(canvas.height * 0.85);
        const fallbackX = Math.floor((canvas.width - fallbackWidth) / 2);
        const fallbackY = Math.floor((canvas.height - fallbackHeight) / 2);
        
        boundaries = {
          x: fallbackX,
          y: fallbackY,
          width: fallbackWidth,
          height: fallbackHeight
        };
      }
      
      // Create new canvas for cropped image
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      
      if (!croppedCtx) {
        reject(new Error('Could not get cropped canvas context'));
        return;
      }
      
      croppedCanvas.width = boundaries.width;
      croppedCanvas.height = boundaries.height;
      
      // Draw the cropped area
      croppedCtx.drawImage(
        canvas,
        boundaries.x, boundaries.y, boundaries.width, boundaries.height,
        0, 0, boundaries.width, boundaries.height
      );
      
      const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.9);
      resolve(dataUrl);
      
    } catch (error) {
      reject(error);
    }
  });
}

// Test function to verify test kit detection
export function testTestKitDetection(imageData: ImageData): {
  simpleDetection: { x: number; y: number; width: number; height: number } | null;
  advancedDetection: { x: number; y: number; width: number; height: number } | null;
  debugInfo: {
    imageWidth: number;
    imageHeight: number;
    whitePixelCount: number;
    totalPixels: number;
    whitePercentage: number;
  };
} {
  const { data, width, height } = imageData;
  const whiteThreshold = 180;
  
  let whitePixelCount = 0;
  const totalPixels = width * height;
  
  // Count white pixels for debugging
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
      whitePixelCount++;
    }
  }
  
  const debugInfo = {
    imageWidth: width,
    imageHeight: height,
    whitePixelCount,
    totalPixels,
    whitePercentage: (whitePixelCount / totalPixels) * 100
  };
  
  // Test both detection methods
  const simpleDetection = detectTestKitBoundaries(imageData);
  const advancedDetection = detectTestKitBoundariesAdvanced(imageData);
  
  console.log('Test Kit Detection Results:', {
    debugInfo,
    simpleDetection,
    advancedDetection
  });
  
  return {
    simpleDetection,
    advancedDetection,
    debugInfo
  };
}