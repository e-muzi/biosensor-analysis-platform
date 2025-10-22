import { calculateCalibrationStripRGBs } from './brightnessAnalysis';
import { estimateConcentrationFromCalibration } from './calibrationAnalysis';
import {
  CALIBRATION_STRIPS,
  PESTICIDE_COORDINATES,
} from '../constants/roiConstants';
import { samplePesticidesAtCoordinates } from '../imageProcessing/pixelSampling';
import type { CalibrationResult } from '../../types';

// Analyze image with calibration strips using new 5-pixel sampling method
// Updated for 3-point calibration system
export function analyzeWithCalibrationStrips(
  image: HTMLImageElement,
  dotPositions?: Array<{ name: string; x: number; y: number }>
): Promise<CalibrationResult[]> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', {
        premultipliedAlpha: false,
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      ctx.drawImage(image, 0, 0);

      const results: CalibrationResult[] = [];

      // Use provided dot positions or fall back to default coordinates
      const coordinates = dotPositions || PESTICIDE_COORDINATES;

      CALIBRATION_STRIPS.forEach((strip, index) => {
        // Calculate calibration strip RGB values
        const calibrationRGBs = calculateCalibrationStripRGBs(ctx, strip);

        // NEW: Use coordinate-based sampling for test area RGB
        const coordinate = coordinates[index];
        if (!coordinate) return; // Skip if no coordinate available
        
        const samplingResults = samplePesticidesAtCoordinates(ctx, [
          coordinate,
        ]);

        // Calculate average RGB from sampled pixels
        const pixels = samplingResults[0]?.pixels || [];
        const averageR =
          pixels.length > 0
            ? pixels.reduce((sum, p) => sum + p.r, 0) / pixels.length
            : 0;
        const averageG =
          pixels.length > 0
            ? pixels.reduce((sum, p) => sum + p.g, 0) / pixels.length
            : 0;
        const averageB =
          pixels.length > 0
            ? pixels.reduce((sum, p) => sum + p.b, 0) / pixels.length
            : 0;
        const testRGB = averageR + averageG + averageB;

        // Estimate concentration
        const { concentration, confidence } =
          estimateConcentrationFromCalibration(
            testRGB,
            calibrationRGBs,
            strip.concentrations
          );

        results.push({
          pesticide: strip.name,
          testRGB,
          calibrationRGBs,
          estimatedConcentration: concentration,
          confidence,
        });
      });

      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
}
