import { calculateBrightnessForRoi } from "../imageProcessing/colorUtils";
import { calculateCalibrationStripBrightnesses } from "./brightnessAnalysis";
import { estimateConcentrationFromCalibration } from "./calibrationAnalysis";
import { CALIBRATION_STRIPS, PESTICIDE_COORDINATES } from "../constants/roiConstants";
import { samplePesticidesAtCoordinates } from "../imageProcessing/pixelSampling";
import type { CalibrationResult, PesticideROI } from "../../types";

// Calculate brightness for multiple ROIs
export function calculateMultipleBrightness(
  image: HTMLImageElement, 
  rois: PesticideROI[]
): Promise<{ name: string; brightness: number; }[]> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { 
        premultipliedAlpha: false,
        willReadFrequently: true 
      }) as CanvasRenderingContext2D;

      if (!ctx) {
        return reject(new Error("Could not get canvas context"));
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

// Analyze image with calibration strips using new 5-pixel sampling method
export function analyzeWithCalibrationStrips(image: HTMLImageElement): Promise<CalibrationResult[]> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { 
        premultipliedAlpha: false,
        willReadFrequently: true 
      }) as CanvasRenderingContext2D;

      if (!ctx) {
        return reject(new Error("Could not get canvas context"));
      }

      ctx.drawImage(image, 0, 0);

      const results: CalibrationResult[] = [];

      CALIBRATION_STRIPS.forEach((strip, index) => {
        // Calculate calibration strip brightnesses
        const calibrationBrightnesses = calculateCalibrationStripBrightnesses(ctx, strip);
        
        // NEW: Use coordinate-based sampling for test area brightness
        const coordinate = PESTICIDE_COORDINATES[index];
        console.log(`Debug: ANALYSIS - Sampling ${strip.name} at coordinate (${coordinate.x}, ${coordinate.y}) canvas: ${canvas.width}x${canvas.height}`);
        const samplingResults = samplePesticidesAtCoordinates(ctx, [coordinate]);
        const testBrightness = samplingResults[0]?.averageBrightness || 0;
        console.log(`Debug: ANALYSIS - ${strip.name} testBrightness: ${testBrightness.toFixed(2)}`);
        
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
