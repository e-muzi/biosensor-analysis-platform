import { PREDEFINED_PESTICIDES } from "../state/pesticideStore";
import type { CalibrationStrip, CalibrationResult } from "../types";

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

// New layout with calibration strips on the left side of each pesticide test area
// Each calibration strip is divided into 5 segments (0, 25, 50, 75, 100 µM)
export const CALIBRATION_STRIPS: CalibrationStrip[] = [
    {
        name: PREDEFINED_PESTICIDES[0].name, // Acephate
        roi: { x: 0.02, y: 0.2, width: 0.08, height: 0.6 },
        concentrations: [0, 25, 50, 75, 100] // µM concentrations
    },
    {
        name: PREDEFINED_PESTICIDES[1].name, // Glyphosate
        roi: { x: 0.245, y: 0.2, width: 0.08, height: 0.6 },
        concentrations: [0, 50, 100, 150, 200] // µM concentrations
    },
    {
        name: PREDEFINED_PESTICIDES[2].name, // Mancozeb
        roi: { x: 0.47, y: 0.2, width: 0.08, height: 0.6 },
        concentrations: [0, 30, 60, 90, 120] // µM concentrations
    },
    {
        name: PREDEFINED_PESTICIDES[3].name, // Cypermethrin
        roi: { x: 0.695, y: 0.2, width: 0.08, height: 0.6 },
        concentrations: [0, 45, 90, 135, 180] // µM concentrations
    }
];

// Updated test areas (moved slightly to the right to make room for calibration strips)
export const PESTICIDE_ROIS: PesticideROI[] = [
    { name: PREDEFINED_PESTICIDES[0].name, roi: { x: 0.12, y: 0.2, width: 0.15, height: 0.6 } }, // Acephate test area
    { name: PREDEFINED_PESTICIDES[1].name, roi: { x: 0.345, y: 0.2, width: 0.15, height: 0.6 } }, // Glyphosate test area
    { name: PREDEFINED_PESTICIDES[2].name, roi: { x: 0.57, y: 0.2, width: 0.15, height: 0.6 } }, // Mancozeb test area
    { name: PREDEFINED_PESTICIDES[3].name, roi: { x: 0.795, y: 0.2, width: 0.15, height: 0.6 } }, // Cypermethrin test area
];

// Converts RGB color to HSV. Returns V (value/brightness) component.
function rgbToHsv_V(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  return max * 255; // Return V component on a 0-255 scale
}



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

// Calculate brightness for each segment of a calibration strip
function calculateCalibrationStripBrightnesses(ctx: CanvasRenderingContext2D, strip: CalibrationStrip): number[] {
    const canvas = ctx.canvas;
    const stripX = Math.floor(canvas.width * strip.roi.x);
    // const stripY = Math.floor(canvas.height * strip.roi.y);
    const stripWidth = Math.floor(canvas.width * strip.roi.width);
    const stripHeight = Math.floor(canvas.height * strip.roi.height);
    
    if (stripWidth <= 0 || stripHeight <= 0) return [0, 0, 0, 0, 0];

    const segmentWidth = stripWidth / 5; // 5 segments in each calibration strip
    const brightnesses: number[] = [];

    for (let i = 0; i < 5; i++) {
        const segmentX = stripX + (i * segmentWidth);
        const segmentROI: ROI = {
            x: segmentX / canvas.width,
            y: strip.roi.y,
            width: segmentWidth / canvas.width,
            height: strip.roi.height
        };
        brightnesses.push(calculateBrightnessForRoi(ctx, segmentROI));
    }

    return brightnesses;
}

// Estimate concentration by comparing test brightness with calibration strip
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