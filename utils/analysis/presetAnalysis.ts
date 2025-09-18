import { calculateBrightnessForRoi } from "../imageProcessing/colorUtils";
import { estimateConcentrationFromCalibration } from "./calibrationAnalysis";
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

        // Calculate test area brightness
        const testBrightness = calculateBrightnessForRoi(ctx, pesticideROI.roi);
        
        // Extract concentrations and brightnesses from the preset curve
        const concentrations = pesticide.curve.map(point => point.concentration);
        const calibrationBrightnesses = pesticide.curve.map(point => point.brightness);
        
        // Estimate concentration using the preset curve
        const { concentration, confidence } = estimateConcentrationFromCalibration(
          testBrightness, 
          calibrationBrightnesses, 
          concentrations
        );
        
        results.push({
          pesticide: pesticideROI.name,
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
