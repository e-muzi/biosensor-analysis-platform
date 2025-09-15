import { analyzeWithCalibrationStrips } from './brightnessCalculations';
import { calculateMultipleBrightness, PESTICIDE_ROIS } from './normalizationAnalysis';
import type { CalibrationResult, AnalysisResult } from '../../types';

export type DetectionMode = 'calibration' | 'normalization';

// Convert normalization results to analysis results format
function convertNormalizationToAnalysis(normalizationResults: { name: string; brightness: number; }[]): AnalysisResult[] {
  return normalizationResults.map(result => ({
    pesticide: result.name,
    brightness: result.brightness,
    concentration: 0, // In normalization mode, we don't calculate concentration
    confidence: 'medium' as const
  }));
}

// Convert calibration results to analysis results format
function convertCalibrationToAnalysis(calibrationResults: CalibrationResult[]): AnalysisResult[] {
  return calibrationResults.map(result => ({
    pesticide: result.pesticide,
    brightness: result.testBrightness,
    concentration: result.estimatedConcentration,
    confidence: result.confidence
  }));
}

// Unified analysis function that switches based on mode
export async function analyzeImage(
  image: HTMLImageElement, 
  mode: DetectionMode
): Promise<{ calibrationResults?: CalibrationResult[]; analysisResults: AnalysisResult[] }> {
  if (mode === 'calibration') {
    const calibrationResults = await analyzeWithCalibrationStrips(image);
    const analysisResults = convertCalibrationToAnalysis(calibrationResults);
    return { calibrationResults, analysisResults };
  } else {
    const normalizationResults = await calculateMultipleBrightness(image, PESTICIDE_ROIS);
    const analysisResults = convertNormalizationToAnalysis(normalizationResults);
    return { analysisResults };
  }
}
