import { estimateConcentrationFromRGB } from './calibrationAnalysis';
import { PESTICIDE_COORDINATES } from '../constants/roiConstants';
import { PREDEFINED_PESTICIDES } from '../../state/pesticideStore';
import { samplePesticidesAtCoordinates } from '../imageProcessing/pixelSampling';
import type { CalibrationResult } from '../../types';

// Analyze image using preset calibration curves
export function analyzeWithPresetCurves(
  image: HTMLImageElement,
  dotPositions?: Array<{ name: string; x: number; y: number }>
): Promise<CalibrationResult[]> {
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

      // Use provided dot positions or fall back to default coordinates
      const coordinates = dotPositions || PESTICIDE_COORDINATES;
      
      // NEW: Use coordinate-based sampling instead of ROI-based
      const samplingResults = samplePesticidesAtCoordinates(
        ctx,
        coordinates
      );

      coordinates.forEach((coordinate, index) => {
        // Find the corresponding pesticide curve
        const pesticide = PREDEFINED_PESTICIDES.find(
          p => p.name === coordinate.name
        );
        if (!pesticide) {
          return;
        }

        // Get RGB values from coordinate sampling
        const samplingResult = samplingResults[index];

        // Calculate average RGB from all sampled pixels (5-pixel sampling)
        const pixels = samplingResult?.pixels || [];
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
        const testRGB = averageR + averageG + averageB; // Total RGB value

        // Console log preset analysis RGB values
        console.log(`🎨 Preset Analysis ${coordinate.name}:`, {
          pesticide: coordinate.name,
          coordinates: { x: coordinate.x, y: coordinate.y },
          sampledPixels: pixels.length,
          averageRGB: { r: Math.round(averageR), g: Math.round(averageG), b: Math.round(averageB) },
          totalRGB: Math.round(testRGB),
          individualPixels: pixels.map(p => ({
            x: Math.round(p.x * ctx.canvas.width),
            y: Math.round(p.y * ctx.canvas.height),
            r: Math.round(p.r),
            g: Math.round(p.g),
            b: Math.round(p.b),
            brightness: Math.round(p.brightness)
          }))
        });

        // Use RGB comparison for concentration estimation
        const { concentration, confidence } = estimateConcentrationFromRGB(
          testRGB,
          pesticide.curve
        );

        results.push({
          pesticide: coordinate.name,
          testRGB,
          calibrationRGBs: pesticide.curve.map(point => point.rgb),
          estimatedConcentration: concentration,
          confidence,
        });
      });

      resolve(results);
    } catch (error) {
      console.error('Error in analyzeWithPresetCurves:', error);
      reject(error);
    }
  });
}
