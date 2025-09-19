import { rgbToHsv_V } from './colorUtils';
import { PESTICIDE_ROIS } from '../constants/roiConstants';

export interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  brightness: number;
}

export interface SamplingResult {
  pesticide: string;
  centerPoint: { x: number; y: number };
  samplingArea: { x: number; y: number; width: number; height: number };
  pixels: PixelData[];
  averageBrightness: number;
  validPixels: number;
  totalPixels: number;
  invalidPixelsFiltered: number;
  samplingMethod: 'spiral_outward' | 'expanded_spiral' | 'fallback_5pixel' | 'error_no_valid_pixels';
  errorMessage?: string;
}

// Enhanced pixel validation function - more sophisticated filtering
function isValidPixel(r: number, g: number, b: number): boolean {
  // Filter out pure black
  if (r === 0 && g === 0 && b === 0) return false;
  
  // Calculate brightness using standard luminance formula
  const brightness = (0.299 * r) + (0.587 * g) + (0.114 * b);
  
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

// Ultra-lenient validation for manual clicking
function isValidPixelForManualClick(r: number, g: number, b: number): boolean {
  // Only filter out pure black pixels for manual clicking
  if (r === 0 && g === 0 && b === 0) return false;
  
  // Accept any non-black pixel for manual analysis
  return true;
}

// Calculate pixel priority score based on brightness and color intensity
function getPixelPriority(r: number, g: number, b: number): number {
  // Use true brightness calculation for priority
  const brightness = (0.299 * r) + (0.587 * g) + (0.114 * b);
  
  // Weight G and B more heavily for biosensor detection
  // Add color intensity bonus for green/blue channels
  const colorBonus = (g * 0.3) + (b * 0.2);
  
  // Add extra bonus for green pixels (common in biosensors)
  const greenBonus = g > r && g > b ? g * 0.1 : 0;
  
  return brightness + colorBonus + greenBonus;
}

// Helper function to create error result
function createErrorResult(pesticideName: string, centerX: number, centerY: number, errorMessage: string): SamplingResult {
  return {
    pesticide: pesticideName,
    centerPoint: { x: centerX, y: centerY },
    samplingArea: { x: 0, y: 0, width: 0, height: 0 },
    pixels: [],
    averageBrightness: 0,
    validPixels: 0,
    totalPixels: 0,
    invalidPixelsFiltered: 0,
    samplingMethod: 'error_no_valid_pixels',
    errorMessage
  };
}

// Sample the entire ROI area as fallback
function sampleFullROI(
  ctx: CanvasRenderingContext2D, 
  pesticideROI: { name: string; roi: { x: number; y: number; width: number; height: number } },
  pesticideName: string
): Array<PixelData & { priority: number }> {
  const canvas = ctx.canvas;
  
  // Convert ROI to pixel coordinates
  const roiStartX = Math.floor(canvas.width * pesticideROI.roi.x);
  const roiStartY = Math.floor(canvas.height * pesticideROI.roi.y);
  const roiEndX = Math.floor(canvas.width * (pesticideROI.roi.x + pesticideROI.roi.width));
  const roiEndY = Math.floor(canvas.height * (pesticideROI.roi.y + pesticideROI.roi.height));
  
  const roiWidth = roiEndX - roiStartX;
  const roiHeight = roiEndY - roiStartY;
  
  // Get image data for the entire ROI
  const imageData = ctx.getImageData(roiStartX, roiStartY, roiWidth, roiHeight);
  const data = imageData.data;
  
  const validPixels: Array<PixelData & { priority: number }> = [];
  
  // Sample every pixel in the ROI
  for (let y = 0; y < roiHeight; y++) {
    for (let x = 0; x < roiWidth; x++) {
      const dataIndex = (y * roiWidth + x) * 4;
      const r = data[dataIndex];
      const g = data[dataIndex + 1];
      const b = data[dataIndex + 2];
      
      // Use more lenient validation for full ROI sampling
      if (isValidPixel(r, g, b)) {
        const brightness = rgbToHsv_V(r, g, b);
        const priority = getPixelPriority(r, g, b);
        
        const pixelData: PixelData & { priority: number } = {
          x: roiStartX + x,
          y: roiStartY + y,
          r,
          g,
          b,
          brightness,
          priority
        };
        
        validPixels.push(pixelData);
      }
    }
  }
  
  console.log(`Debug: Full ROI sampling for ${pesticideName} found ${validPixels.length} valid pixels`);
  return validPixels;
}

// Spiral outward pixel sampling with enhanced validation
export function sampleFivePixels(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  pesticideName: string
): SamplingResult {
  const canvas = ctx.canvas;
  
  // Validate canvas context and dimensions
  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    console.error(`Debug: Invalid canvas for ${pesticideName} - width: ${canvas?.width}, height: ${canvas?.height}`);
    return createErrorResult(pesticideName, centerX, centerY, "Invalid canvas dimensions");
  }
  
  console.log(`Debug: Canvas dimensions for ${pesticideName}: ${canvas.width}x${canvas.height}`);
  
  // Convert percentage coordinates to pixel coordinates with better precision
  const pixelCenterX = Math.round(canvas.width * centerX);
  const pixelCenterY = Math.round(canvas.height * centerY);
  
  console.log(`Debug: Spiral sampling ${pesticideName} at center (${centerX}, ${centerY}) -> pixel (${pixelCenterX}, ${pixelCenterY})`);
  
  // Find the corresponding pesticide ROI for boundary limits
  const pesticideROI = PESTICIDE_ROIS.find(roi => roi.name === pesticideName);
  if (!pesticideROI) {
    console.error(`No ROI found for pesticide: ${pesticideName}`);
    return createErrorResult(pesticideName, centerX, centerY, "No ROI configuration found");
  }
  
  // Convert ROI boundaries to pixel coordinates
  const roiStartX = Math.floor(canvas.width * pesticideROI.roi.x);
  const roiStartY = Math.floor(canvas.height * pesticideROI.roi.y);
  const roiEndX = Math.floor(canvas.width * (pesticideROI.roi.x + pesticideROI.roi.width));
  const roiEndY = Math.floor(canvas.height * (pesticideROI.roi.y + pesticideROI.roi.height));
  
  console.log(`Debug: ${pesticideName} ROI bounds - pixel coords: (${roiStartX}, ${roiStartY}) to (${roiEndX}, ${roiEndY}), center: (${pixelCenterX}, ${pixelCenterY})`);
  
  // Enhanced diagnostic for edge pesticides (Acephate and Atrazine)
  if (pesticideName === 'Acephate' || pesticideName === 'Atrazine') {
    console.log(`Debug: ${pesticideName} diagnostic - sampling center and corner pixels:`);
    const diagnosticPixels = [
      { x: pixelCenterX, y: pixelCenterY, name: 'center' },
      { x: roiStartX, y: roiStartY, name: 'top-left' },
      { x: roiEndX, y: roiStartY, name: 'top-right' },
      { x: roiStartX, y: roiEndY, name: 'bottom-left' },
      { x: roiEndX, y: roiEndY, name: 'bottom-right' },
      // Add midpoints for edge pesticides
      { x: Math.floor((roiStartX + roiEndX) / 2), y: pixelCenterY, name: 'mid-horizontal' },
      { x: pixelCenterX, y: Math.floor((roiStartY + roiEndY) / 2), name: 'mid-vertical' }
    ];
    
    diagnosticPixels.forEach(pixel => {
      if (pixel.x >= 0 && pixel.x < canvas.width && pixel.y >= 0 && pixel.y < canvas.height) {
        const imageData = ctx.getImageData(pixel.x, pixel.y, 1, 1);
        const data = imageData.data;
        const r = data[0];
        const g = data[1];
        const b = data[2];
        const brightness = (0.299 * r) + (0.587 * g) + (0.114 * b);
        console.log(`Debug: ${pesticideName} ${pixel.name} (${pixel.x}, ${pixel.y}): RGB(${r}, ${g}, ${b}) brightness: ${brightness.toFixed(1)}`);
      }
    });
  }
  
  let allValidPixels: Array<PixelData & { priority: number }> = [];
  let invalidPixelsFiltered = 0;
  let samplingMethod: 'spiral_outward' | 'expanded_spiral' | 'fallback_5pixel' | 'error_no_valid_pixels' = 'spiral_outward';
  
  // Variables to track sampling area
  let minSampledX = pixelCenterX;
  let maxSampledX = pixelCenterX;
  let minSampledY = pixelCenterY;
  let maxSampledY = pixelCenterY;
  
  // Sample pixels in expanding squares from center - more comprehensive sampling
  let radius = 0;
  const maxRadius = Math.max(
    Math.max(pixelCenterX - roiStartX, roiEndX - pixelCenterX),
    Math.max(pixelCenterY - roiStartY, roiEndY - pixelCenterY)
  );
  
  while (radius <= maxRadius) {
    // Sample pixels in the current square area
    const startX = Math.max(roiStartX, pixelCenterX - radius);
    const endX = Math.min(roiEndX, pixelCenterX + radius);
    const startY = Math.max(roiStartY, pixelCenterY - radius);
    const endY = Math.min(roiEndY, pixelCenterY + radius);
    
    // Get image data for the entire square area
    const squareWidth = endX - startX + 1;
    const squareHeight = endY - startY + 1;
    
    if (squareWidth > 0 && squareHeight > 0) {
      const imageData = ctx.getImageData(startX, startY, squareWidth, squareHeight);
      const data = imageData.data;
      
      // Sample pixels in this square
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          // For radius 0, sample center pixel only
          // For radius > 0, sample only new pixels on the perimeter
          const isCenterPixel = radius === 0;
          const isPerimeterPixel = radius > 0 && (x === startX || x === endX || y === startY || y === endY);
          
          if (isCenterPixel || isPerimeterPixel) {
            // Ensure we're within canvas bounds
            if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
              const localX = x - startX;
              const localY = y - startY;
              const dataIndex = (localY * squareWidth + localX) * 4;
              
              const r = data[dataIndex];
              const g = data[dataIndex + 1];
              const b = data[dataIndex + 2];
              const alpha = data[dataIndex + 3];
              
              // Enhanced debug logging for first few pixels
              if (allValidPixels.length < 3) {
                console.log(`Debug: ${pesticideName} pixel at (${x}, ${y}): RGBA(${r}, ${g}, ${b}, ${alpha})`);
              }
              
            // Validate pixel
            if (isValidPixel(r, g, b)) {
                const brightness = rgbToHsv_V(r, g, b);
                const priority = getPixelPriority(r, g, b);
                
                const pixelData: PixelData & { priority: number } = {
                  x,
                  y,
                  r,
                  g,
                  b,
                  brightness,
                  priority
                };
                
                allValidPixels.push(pixelData);
                
                // Update sampling area bounds
                minSampledX = Math.min(minSampledX, x);
                maxSampledX = Math.max(maxSampledX, x);
                minSampledY = Math.min(minSampledY, y);
                maxSampledY = Math.max(maxSampledY, y);
              } else {
                invalidPixelsFiltered++;
                // Debug: Log first few invalid pixels
                if (invalidPixelsFiltered <= 5) {
                  console.log(`Debug: ${pesticideName} invalid pixel at (${x}, ${y}): RGB(${r}, ${g}, ${b}) - rejected`);
                }
              }
            }
          }
        }
      }
    }
    
    // Move to next ring
    radius++;
    if (radius > 1) {
      samplingMethod = 'expanded_spiral';
    }
  }
  
  // Sort pixels by priority (highest brightness + color bonus first) and take top pixels
  allValidPixels.sort((a, b) => b.priority - a.priority);
  const selectedPixels = allValidPixels.slice(0, Math.min(15, allValidPixels.length));
  
  // Convert back to regular PixelData array
  const pixels: PixelData[] = selectedPixels.map(p => ({
    x: p.x,
    y: p.y,
    r: p.r,
    g: p.g,
    b: p.b,
    brightness: p.brightness
  }));
  
  const validPixels = pixels.length;
  const totalBrightness = pixels.reduce((sum, p) => sum + p.brightness, 0);
  
  // Check if we found enough valid pixels
  // Use lower threshold for edge pesticides (Acephate and Atrazine)
  const minPixelsRequired = (pesticideName === 'Acephate' || pesticideName === 'Atrazine') ? 3 : 5;
  
  if (validPixels < minPixelsRequired) {
    console.warn(`Warning: Only ${validPixels} valid pixels found in ${pesticideName} ROI (${invalidPixelsFiltered} invalid pixels filtered)`);
    
    // Try sampling the entire ROI area as fallback
    console.log(`Debug: Trying full ROI sampling for ${pesticideName}`);
    const fullROIPixels = sampleFullROI(ctx, pesticideROI, pesticideName);
    
    if (fullROIPixels.length >= minPixelsRequired) {
      console.log(`Debug: Full ROI sampling found ${fullROIPixels.length} valid pixels for ${pesticideName}`);
      
      // Sort by priority and take top pixels
      const sortedPixels = fullROIPixels.sort((a, b) => b.priority - a.priority);
      const selectedPixels = sortedPixels.slice(0, Math.min(15, sortedPixels.length));
      
      const finalPixels: PixelData[] = selectedPixels.map(p => ({
        x: p.x,
        y: p.y,
        r: p.r,
        g: p.g,
        b: p.b,
        brightness: p.brightness
      }));
      
      const finalValidPixels = finalPixels.length;
      const finalTotalBrightness = finalPixels.reduce((sum, p) => sum + p.brightness, 0);
      const finalAverageBrightness = finalValidPixels > 0 ? finalTotalBrightness / finalValidPixels : 0;
      
      return {
        pesticide: pesticideName,
        centerPoint: { x: centerX, y: centerY },
        samplingArea: {
          x: pesticideROI.roi.x,
          y: pesticideROI.roi.y,
          width: pesticideROI.roi.width,
          height: pesticideROI.roi.height
        },
        pixels: finalPixels,
        averageBrightness: finalAverageBrightness,
        validPixels: finalValidPixels,
        totalPixels: Math.floor(canvas.width * pesticideROI.roi.width) * Math.floor(canvas.height * pesticideROI.roi.height),
        invalidPixelsFiltered: invalidPixelsFiltered,
        samplingMethod: 'expanded_spiral'
      };
    }
    
    const errorMsg = `Only ${validPixels} valid pixels found in ${pesticideName} ROI (${invalidPixelsFiltered} invalid pixels filtered)`;
    return createErrorResult(pesticideName, centerX, centerY, errorMsg);
  }
  
  const averageBrightness = validPixels > 0 ? totalBrightness / validPixels : 0;
  const samplingWidth = maxSampledX - minSampledX + 1;
  const samplingHeight = maxSampledY - minSampledY + 1;
  
  console.log(`Debug: ${pesticideName} priority-based sampling complete - ${validPixels} pixels selected from ${allValidPixels.length} valid pixels (${invalidPixelsFiltered} invalid filtered), method: ${samplingMethod}`);
  
  // Log the top pixel priorities for debugging
  if (selectedPixels.length > 0) {
    const topPixel = selectedPixels[0];
    console.log(`Debug: Top pixel for ${pesticideName}: RGB(${topPixel.r}, ${topPixel.g}, ${topPixel.b}) priority: ${topPixel.priority.toFixed(1)}`);
  } else if (pesticideName === 'Acephate') {
    console.log(`Debug: Acephate - No valid pixels found. Total pixels sampled: ${allValidPixels.length}, Invalid filtered: ${invalidPixelsFiltered}`);
  }
  
  return {
    pesticide: pesticideName,
    centerPoint: { x: centerX, y: centerY },
    samplingArea: {
      x: minSampledX / canvas.width,
      y: minSampledY / canvas.height,
      width: samplingWidth / canvas.width,
      height: samplingHeight / canvas.height
    },
    pixels,
    averageBrightness,
    validPixels,
    totalPixels: samplingWidth * samplingHeight,
    invalidPixelsFiltered,
    samplingMethod
  };
}


// Dynamic ROI detection and adjustment
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
  
  if (adjusted) {
    console.log(`Debug: ROI adjusted for ${pesticideName} from (${originalCenterX.toFixed(3)}, ${originalCenterY.toFixed(3)}) to (${adjustedCenterX.toFixed(3)}, ${adjustedCenterY.toFixed(3)})`);
  }
  
  return { x: adjustedCenterX, y: adjustedCenterY, adjusted };
}

// Enhanced sampling for edge pesticides (Acephate and Atrazine)
function sampleEdgePesticide(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  pesticideName: string
): SamplingResult {
  const canvas = ctx.canvas;
  
  // Find the corresponding pesticide ROI
  const pesticideROI = PESTICIDE_ROIS.find(roi => roi.name === pesticideName);
  if (!pesticideROI) {
    return createErrorResult(pesticideName, centerX, centerY, "No ROI configuration found");
  }
  
  // Convert ROI boundaries to pixel coordinates
  const roiStartX = Math.floor(canvas.width * pesticideROI.roi.x);
  const roiStartY = Math.floor(canvas.height * pesticideROI.roi.y);
  const roiEndX = Math.floor(canvas.width * (pesticideROI.roi.x + pesticideROI.roi.width));
  const roiEndY = Math.floor(canvas.height * (pesticideROI.roi.y + pesticideROI.roi.height));
  
  console.log(`Debug: ${pesticideName} edge sampling - ROI bounds: (${roiStartX}, ${roiStartY}) to (${roiEndX}, ${roiEndY})`);
  
  // Sample the entire ROI area more aggressively
  const roiWidth = roiEndX - roiStartX;
  const roiHeight = roiEndY - roiStartY;
  
  if (roiWidth <= 0 || roiHeight <= 0) {
    return createErrorResult(pesticideName, centerX, centerY, "Invalid ROI dimensions");
  }
  
  const imageData = ctx.getImageData(roiStartX, roiStartY, roiWidth, roiHeight);
  const data = imageData.data;
  
  const validPixels: Array<PixelData & { priority: number }> = [];
  let invalidPixelsFiltered = 0;
  
  // Sample every pixel in the ROI with more lenient validation
  for (let y = 0; y < roiHeight; y++) {
    for (let x = 0; x < roiWidth; x++) {
      const dataIndex = (y * roiWidth + x) * 4;
      const r = data[dataIndex];
      const g = data[dataIndex + 1];
      const b = data[dataIndex + 2];
      
      // Ultra-lenient validation for edge pesticides - only exclude pure black
      if (isValidPixelForManualClick(r, g, b)) {
        const brightness = rgbToHsv_V(r, g, b);
        const priority = getPixelPriority(r, g, b);
        
        const pixelData: PixelData & { priority: number } = {
          x: roiStartX + x,
          y: roiStartY + y,
          r,
          g,
          b,
          brightness,
          priority
        };
        
        validPixels.push(pixelData);
      } else {
        invalidPixelsFiltered++;
      }
    }
  }
  
  // Sort by priority and take top pixels
  validPixels.sort((a, b) => b.priority - a.priority);
  const selectedPixels = validPixels.slice(0, Math.min(20, validPixels.length));
  
  const pixels: PixelData[] = selectedPixels.map(p => ({
    x: p.x,
    y: p.y,
    r: p.r,
    g: p.g,
    b: p.b,
    brightness: p.brightness
  }));
  
  const validPixelsCount = pixels.length;
  const totalBrightness = pixels.reduce((sum, p) => sum + p.brightness, 0);
  const averageBrightness = validPixelsCount > 0 ? totalBrightness / validPixelsCount : 0;
  
  console.log(`Debug: ${pesticideName} edge sampling complete - ${validPixelsCount} pixels, avg brightness: ${averageBrightness.toFixed(1)}`);
  
  return {
    pesticide: pesticideName,
    centerPoint: { x: centerX, y: centerY },
    samplingArea: {
      x: pesticideROI.roi.x,
      y: pesticideROI.roi.y,
      width: pesticideROI.roi.width,
      height: pesticideROI.roi.height
    },
    pixels,
    averageBrightness,
    validPixels: validPixelsCount,
    totalPixels: roiWidth * roiHeight,
    invalidPixelsFiltered,
    samplingMethod: 'expanded_spiral'
  };
}

// Manual pixel sampling at clicked coordinates
export function samplePixelsAtClick(
  ctx: CanvasRenderingContext2D,
  clickX: number,
  clickY: number,
  canvasWidth: number,
  canvasHeight: number,
  sampleRadius: number = 10
): SamplingResult {
  const canvas = ctx.canvas;
  
  // Convert display coordinates to natural image coordinates with better precision
  const naturalX = Math.round((clickX / canvasWidth) * canvas.width);
  const naturalY = Math.round((clickY / canvasHeight) * canvas.height);
  
  console.log(`Debug: Manual pixel sampling at click (${clickX}, ${clickY}) -> natural (${naturalX}, ${naturalY})`);
  
  // Debug: Sample the exact click point first
  if (naturalX >= 0 && naturalX < canvas.width && naturalY >= 0 && naturalY < canvas.height) {
    const clickImageData = ctx.getImageData(naturalX, naturalY, 1, 1);
    const clickData = clickImageData.data;
    const clickR = clickData[0];
    const clickG = clickData[1];
    const clickB = clickData[2];
    const clickBrightness = rgbToHsv_V(clickR, clickG, clickB);
    console.log(`Debug: Click point RGB(${clickR}, ${clickG}, ${clickB}) brightness: ${clickBrightness.toFixed(1)}`);
  }
  
  // Define sampling area around clicked point
  const startX = Math.max(0, naturalX - sampleRadius);
  const endX = Math.min(canvas.width, naturalX + sampleRadius);
  const startY = Math.max(0, naturalY - sampleRadius);
  const endY = Math.min(canvas.height, naturalY + sampleRadius);
  
  const areaWidth = endX - startX;
  const areaHeight = endY - startY;
  
  if (areaWidth <= 0 || areaHeight <= 0) {
    return createErrorResult('Manual Click', clickX / canvasWidth, clickY / canvasHeight, "Invalid sampling area");
  }
  
  const imageData = ctx.getImageData(startX, startY, areaWidth, areaHeight);
  const data = imageData.data;
  
  const validPixels: Array<PixelData & { priority: number }> = [];
  let invalidPixelsFiltered = 0;
  
  // Sample pixels in the area
  for (let y = 0; y < areaHeight; y++) {
    for (let x = 0; x < areaWidth; x++) {
      const dataIndex = (y * areaWidth + x) * 4;
      const r = data[dataIndex];
      const g = data[dataIndex + 1];
      const b = data[dataIndex + 2];
      
      // Ultra-lenient validation for manual sampling - only exclude pure black
      if (isValidPixelForManualClick(r, g, b)) {
        const brightness = rgbToHsv_V(r, g, b);
        const priority = getPixelPriority(r, g, b);
        
        const pixelData: PixelData & { priority: number } = {
          x: startX + x,
          y: startY + y,
          r,
          g,
          b,
          brightness,
          priority
        };
        
        validPixels.push(pixelData);
      } else {
        invalidPixelsFiltered++;
      }
    }
  }
  
  // Sort by priority and take top pixels
  validPixels.sort((a, b) => b.priority - a.priority);
  const selectedPixels = validPixels.slice(0, Math.min(25, validPixels.length));
  
  const pixels: PixelData[] = selectedPixels.map(p => ({
    x: p.x,
    y: p.y,
    r: p.r,
    g: p.g,
    b: p.b,
    brightness: p.brightness
  }));
  
  const validPixelsCount = pixels.length;
  const totalBrightness = pixels.reduce((sum, p) => sum + p.brightness, 0);
  const averageBrightness = validPixelsCount > 0 ? totalBrightness / validPixelsCount : 0;
  
  console.log(`Debug: Manual sampling complete - ${validPixelsCount} pixels, avg brightness: ${averageBrightness.toFixed(1)}`);
  
  return {
    pesticide: 'Manual Click',
    centerPoint: { x: clickX / canvasWidth, y: clickY / canvasHeight },
    samplingArea: {
      x: startX / canvas.width,
      y: startY / canvas.height,
      width: areaWidth / canvas.width,
      height: areaHeight / canvas.height
    },
    pixels,
    averageBrightness,
    validPixels: validPixelsCount,
    totalPixels: areaWidth * areaHeight,
    invalidPixelsFiltered,
    samplingMethod: 'expanded_spiral'
  };
}

// Sample all pesticide center points with dynamic ROI adjustment
export function sampleAllPesticidePixels(
  ctx: CanvasRenderingContext2D,
  centerPoints: Array<{ name: string; roi: { x: number; y: number; width: number; height: number } }>
): SamplingResult[] {
  return centerPoints.map(centerPoint => {
    // Use special edge sampling for Acephate and Atrazine
    if (centerPoint.name === 'Acephate' || centerPoint.name === 'Atrazine') {
      console.log(`Debug: Using edge sampling for ${centerPoint.name}`);
      return sampleEdgePesticide(ctx, centerPoint.roi.x, centerPoint.roi.y, centerPoint.name);
    }
    
    // First, try to detect and adjust the ROI dynamically for other pesticides
    const adjustedROI = detectAndAdjustROI(ctx, centerPoint.roi.x, centerPoint.roi.y, centerPoint.name);
    
    // Use the adjusted coordinates for sampling
    return sampleFivePixels(ctx, adjustedROI.x, adjustedROI.y, centerPoint.name);
  });
}
