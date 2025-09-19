import { PREDEFINED_PESTICIDES } from "../../state/pesticideStore";

// Not used 
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

// White reference ROI for normalization (non-pesticide white area)
export const WHITE_REFERENCE_ROI: ROI = { x: 0.85, y: 0.2, width: 0.1, height: 0.6 }; // Right side white area

// Hardcoded ROIs for the 4-pesticide kit layout (rectangular white box, left to right)
export const PESTICIDE_ROIS: PesticideROI[] = [
    { name: PREDEFINED_PESTICIDES[0].name, roi: { x: 0.05, y: 0.2, width: 0.2, height: 0.6 } }, // Leftmost
    { name: PREDEFINED_PESTICIDES[1].name, roi: { x: 0.275, y: 0.2, width: 0.2, height: 0.6 } }, // Second from left
    { name: PREDEFINED_PESTICIDES[2].name, roi: { x: 0.5, y: 0.2, width: 0.2, height: 0.6 } }, // Third from left
    { name: PREDEFINED_PESTICIDES[3].name, roi: { x: 0.725, y: 0.2, width: 0.2, height: 0.6 } }, // Rightmost
];

// Converts RGB color to HSV. Returns V (value/brightness) component.
function rgbToHsv_V(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  return max * 255; // Return V component on a 0-255 scale
}

// Calculate average RGB values for a given ROI
function calculateAverageRGB(ctx: CanvasRenderingContext2D, roi: ROI): { r: number; g: number; b: number } {
  const canvas = ctx.canvas;
  const roiX = Math.floor(canvas.width * roi.x);
  const roiY = Math.floor(canvas.height * roi.y);
  const roiWidth = Math.floor(canvas.width * roi.width);
  const roiHeight = Math.floor(canvas.height * roi.height);
  
  if (roiWidth <= 0 || roiHeight <= 0) return { r: 0, g: 0, b: 0 };

  const imageData = ctx.getImageData(roiX, roiY, roiWidth, roiHeight);
  const data = imageData.data;
  
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let pixelCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    totalR += data[i];
    totalG += data[i + 1];
    totalB += data[i + 2];
    pixelCount++;
  }
  
  return {
    r: totalR / pixelCount,
    g: totalG / pixelCount,
    b: totalB / pixelCount
  };
}

// Normalize RGB values based on white reference
function normalizeRGB(r: number, g: number, b: number, whiteReference: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  // Calculate normalization factors (assuming white should be 255,255,255)
  const rFactor = 255 / whiteReference.r;
  const gFactor = 255 / whiteReference.g;
  const bFactor = 255 / whiteReference.b;
  
  // Apply normalization and clamp to 0-255 range
  return {
    r: Math.max(0, Math.min(255, r * rFactor)),
    g: Math.max(0, Math.min(255, g * gFactor)),
    b: Math.max(0, Math.min(255, b * bFactor))
  };
}

function calculateBrightnessForRoi(ctx: CanvasRenderingContext2D, roi: ROI, whiteReference?: { r: number; g: number; b: number }): number {
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
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply normalization if white reference is provided
      if (whiteReference) {
        const normalized = normalizeRGB(r, g, b, whiteReference);
        r = normalized.r;
        g = normalized.g;
        b = normalized.b;
      }
      
      const brightness = rgbToHsv_V(r, g, b);
      totalBrightness += brightness;
      pixelCount++;
    }
    
    return totalBrightness / pixelCount;
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

      // Calculate white reference for normalization
      const whiteReference = calculateAverageRGB(ctx, WHITE_REFERENCE_ROI);
      
      // Check if white reference is valid (not too dark)
      const whiteBrightness = rgbToHsv_V(whiteReference.r, whiteReference.g, whiteReference.b);
      if (whiteBrightness < 50) {
        console.warn('White reference area appears too dark. Normalization may not be accurate.');
      }

      const results = rois.map(pesticideROI => {
          const brightness = calculateBrightnessForRoi(ctx, pesticideROI.roi, whiteReference);
          return { name: pesticideROI.name, brightness };
      });
      
      resolve(results);

    } catch (error) {
      reject(error);
    }
  });
}
