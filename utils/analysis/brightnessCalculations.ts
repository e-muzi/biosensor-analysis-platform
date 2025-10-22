import { calculateCalibrationStripRGBs } from './brightnessAnalysis';
import { estimateConcentrationFromCalibration } from './calibrationAnalysis';
import {
  CALIBRATION_STRIPS,
  PESTICIDE_COORDINATES,
  CALIBRATION_POINTS,
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

      // Console log calibration points RGB values
      console.log('🎯 Calibration Points Analysis:');
      CALIBRATION_POINTS.forEach((point, index) => {
        const samplingResults = samplePesticidesAtCoordinates(ctx, [
          { name: `Calibration Point ${index + 1}`, x: point.x, y: point.y }
        ]);
        
        const pixels = samplingResults[0]?.pixels || [];
        const averageR = pixels.length > 0 ? pixels.reduce((sum, p) => sum + p.r, 0) / pixels.length : 0;
        const averageG = pixels.length > 0 ? pixels.reduce((sum, p) => sum + p.g, 0) / pixels.length : 0;
        const averageB = pixels.length > 0 ? pixels.reduce((sum, p) => sum + p.b, 0) / pixels.length : 0;
        const totalRGB = averageR + averageG + averageB;

        console.log(`📍 Calibration Point ${index + 1} (${point.concentration}):`, {
          coordinates: { x: point.x, y: point.y },
          concentration: point.concentration,
          sampledPixels: pixels.length,
          averageRGB: { r: Math.round(averageR), g: Math.round(averageG), b: Math.round(averageB) },
          totalRGB: Math.round(totalRGB),
          individualPixels: pixels.map(p => ({
            x: Math.round(p.x * ctx.canvas.width),
            y: Math.round(p.y * ctx.canvas.height),
            r: Math.round(p.r),
            g: Math.round(p.g),
            b: Math.round(p.b),
            brightness: Math.round(p.brightness)
          }))
        });
      });

      CALIBRATION_STRIPS.forEach((strip, index) => {
        // Calculate calibration strip RGB values
        const calibrationRGBs = calculateCalibrationStripRGBs(ctx, strip);

        // Console log calibration strip RGB values
        console.log(`🔬 Calibration Strip ${strip.name}:`, {
          strip: strip.name,
          roi: strip.roi,
          concentrations: strip.concentrations,
          calibrationRGBs: calibrationRGBs,
          calibrationRGBDetails: calibrationRGBs.map((rgb, i) => ({
            segment: i + 1,
            concentration: strip.concentrations[i],
            totalRGB: rgb,
            individualRGB: `R:${Math.floor(rgb/3)}, G:${Math.floor(rgb/3)}, B:${Math.floor(rgb/3)}`
          }))
        });

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

        // Console log test area RGB values
        console.log(`🧪 Test Area ${coordinate.name}:`, {
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
