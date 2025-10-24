import { estimateConcentrationFromRGB } from './calibrationAnalysis';
import { PESTICIDE_COORDINATES, PESTICIDE_COORDINATES_CAPTURE_MODE } from '../constants/roiConstants';
import { PREDEFINED_PESTICIDES } from '../../state/pesticideStore';
import { samplePesticidesAtCoordinates } from '../imageProcessing/pixelSampling';
import type { CalibrationResult } from '../../types';

// Analyze image using preset calibration curves
export function analyzeWithPresetCurves(
  image: HTMLImageElement,
  isCaptureMode: boolean = false
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

      // Choose coordinates based on mode
      const coordinates = isCaptureMode ? PESTICIDE_COORDINATES_CAPTURE_MODE : PESTICIDE_COORDINATES;
      
      // Log the coordinates being used for analysis
      console.log(`🔍 Analysis Mode: ${isCaptureMode ? 'CAMERA CAPTURE' : 'UPLOAD/NORMAL'}`);
      console.log('📍 Pixel coordinates for analysis:', coordinates);

      // Verify that guiding dots match analysis coordinates
      if (isCaptureMode) {
        console.log('🔍 Verifying guiding dots match analysis coordinates...');
        // Convert pixel coordinates to percentage for comparison
        const analysisPercentages = coordinates.map(coord => ({
          name: coord.name,
          x: coord.x / image.naturalWidth,
          y: coord.y / image.naturalHeight
        }));
        console.log('📍 Analysis coordinates as percentages:', analysisPercentages);
      }

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

        // Log the analysis position for verification
        console.log(`🎯 ${coordinate.name}: Analyzing at (${coordinate.x}, ${coordinate.y})`);

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
          isCaptureMode: isCaptureMode, // Track if this was capture mode analysis
        });
      });

      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
}
