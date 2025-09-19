import { calculateBrightnessForRoi, calculateAverageRGBForRoi, rgbToHsv_V } from "../imageProcessing/colorUtils";
import { estimateConcentrationFromCalibration, estimateConcentrationFromRGB } from "./calibrationAnalysis";
import { PESTICIDE_ROIS } from "../constants/roiConstants";
import { PREDEFINED_PESTICIDES } from "../../state/pesticideStore";
import type { CalibrationResult } from "../../types";

// Analyze image using preset calibration curves
export function analyzeWithPresetCurves(image: HTMLImageElement): Promise<CalibrationResult[]> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        return reject(new Error("Could not get canvas context"));
      }

      ctx.drawImage(image, 0, 0);

      const results: CalibrationResult[] = [];

      PESTICIDE_ROIS.forEach((pesticideROI) => {
        // Find the corresponding pesticide curve
        const pesticide = PREDEFINED_PESTICIDES.find(p => p.name === pesticideROI.name);
        if (!pesticide) {
          console.warn(`No preset curve found for pesticide: ${pesticideROI.name}`);
          return;
        }

        // Calculate test area RGB values
        const testRGB = calculateAverageRGBForRoi(ctx, pesticideROI.roi);
        const testBrightness = rgbToHsv_V(testRGB.r, testRGB.g, testRGB.b);
        
        // Debug logging
        console.log(`Debug: ${pesticideROI.name} - Test RGB: (${testRGB.r}, ${testRGB.g}, ${testRGB.b}), Brightness: ${testBrightness.toFixed(1)}`);
        console.log(`Debug: ${pesticideROI.name} - ROI: x=${pesticideROI.roi.x.toFixed(3)}, y=${pesticideROI.roi.y.toFixed(3)}, w=${pesticideROI.roi.width.toFixed(3)}, h=${pesticideROI.roi.height.toFixed(3)}`);
        
        // Use RGB comparison for concentration estimation
        const { concentration, confidence } = estimateConcentrationFromRGB(
          testRGB,
          pesticide.curve
        );
        
        console.log(`Debug: ${pesticideROI.name} - Estimated concentration: ${concentration.toFixed(3)} µM, Confidence: ${confidence}`);
        
        results.push({
          pesticide: pesticideROI.name,
          testBrightness,
          calibrationBrightnesses: pesticide.curve.map(point => 
            point.brightness || rgbToHsv_V(point.rgb.r, point.rgb.g, point.rgb.b)
          ),
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
