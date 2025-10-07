import { analyzeWithCalibrationStrips } from './brightnessCalculations';
import { analyzeWithPresetCurves } from './presetAnalysis';
import type { CalibrationResult, AnalysisResult } from '../../types';

export type DetectionMode = 'preset' | 'strip';

// Convert calibration results to analysis results format
function convertCalibrationToAnalysis(
  calibrationResults: CalibrationResult[]
): AnalysisResult[] {
  return calibrationResults.map(result => ({
    pesticide: result.pesticide,
    rgb: result.testRGB,
    concentration: result.estimatedConcentration,
    confidence: result.confidence,
  }));
}

// Unified analysis function that switches based on mode
export async function analyzeImage(
  image: HTMLImageElement,
  mode: DetectionMode
): Promise<{
  calibrationResults?: CalibrationResult[];
  analysisResults: AnalysisResult[];
}> {
  if (mode === 'strip') {
    const calibrationResults = await analyzeWithCalibrationStrips(image);
    const analysisResults = convertCalibrationToAnalysis(calibrationResults);
    return { calibrationResults, analysisResults };
  } else {
    // Preset mode - use predefined curves
    const presetResults = await analyzeWithPresetCurves(image);
    const analysisResults = convertCalibrationToAnalysis(presetResults);
    return { calibrationResults: presetResults, analysisResults };
  }
}
