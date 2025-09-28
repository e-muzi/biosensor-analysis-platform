import { estimateConcentrationFromRGB } from './calibrationAnalysis';
import { PESTICIDE_COORDINATES } from '../constants/roiConstants';
import { PREDEFINED_PESTICIDES } from '../../state/pesticideStore';
import { samplePesticidesAtCoordinates } from '../imageProcessing/pixelSampling';
import type { CalibrationResult } from '../../types';

// Analyze image using preset calibration curves
export function analyzeWithPresetCurves(
  image: HTMLImageElement
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

      // NEW: Use coordinate-based sampling instead of ROI-based
      const samplingResults = samplePesticidesAtCoordinates(
        ctx,
        PESTICIDE_COORDINATES
      );

      PESTICIDE_COORDINATES.forEach((coordinate, index) => {
        // Find the corresponding pesticide curve
        const pesticide = PREDEFINED_PESTICIDES.find(
          p => p.name === coordinate.name
        );
        if (!pesticide) {
          console.warn(
            `No preset curve found for pesticide: ${coordinate.name}`
          );
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

        // Debug logging
        console.log(
          `Debug: ${coordinate.name} - Coordinate: (${coordinate.x}, ${coordinate.y})`
        );
        console.log(
          `Debug: ${coordinate.name} - Test RGB: ${testRGB.toFixed(1)}`
        );

        // Use RGB comparison for concentration estimation
        const { concentration, confidence } = estimateConcentrationFromRGB(
          testRGB,
          pesticide.curve
        );

        console.log(
          `Debug: ${coordinate.name} - Estimated concentration: ${concentration.toFixed(3)} µM, Confidence: ${confidence}`
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
      reject(error);
    }
  });
}
