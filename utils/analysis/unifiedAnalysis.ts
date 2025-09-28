import { analyzeWithCalibrationStrips } from './brightnessCalculations';
import { analyzeWithPresetCurves } from './presetAnalysis';
import type { CalibrationResult, AnalysisResult } from '../../types';

export type DetectionMode = 'preset' | 'strip';

// Convert calibration results to analysis results format
function convertCalibrationToAnalysis(calibrationResults: CalibrationResult[]): AnalysisResult[] {
  return calibrationResults.map(result => ({
    pesticide: result.pesticide,
    rgb: result.testRGB,
    concentration: result.estimatedConcentration,
    confidence: result.confidence
  }));
}


// Unified analysis function that switches based on mode
export async function analyzeImage(
  image: HTMLImageElement, 
  mode: DetectionMode
): Promise<{ calibrationResults?: CalibrationResult[]; analysisResults: AnalysisResult[] }> {
  console.log(`Debug: UNIFIED ANALYSIS - Starting analysis with mode: ${mode}, image: ${image.naturalWidth}x${image.naturalHeight}`);
  
  if (mode === 'strip') {
    console.log('Debug: UNIFIED ANALYSIS - Using strip mode (analyzeWithCalibrationStrips)');
    const calibrationResults = await analyzeWithCalibrationStrips(image);
    const analysisResults = convertCalibrationToAnalysis(calibrationResults);
    console.log('Debug: UNIFIED ANALYSIS - Strip mode results:', calibrationResults.map(r => `${r.pesticide}: ${r.testRGB.toFixed(0)}`));
    return { calibrationResults, analysisResults };
  } else {
    console.log('Debug: UNIFIED ANALYSIS - Using preset mode (analyzeWithPresetCurves)');
    // Preset mode - use predefined curves
    const presetResults = await analyzeWithPresetCurves(image);
    const analysisResults = convertCalibrationToAnalysis(presetResults);
    console.log('Debug: UNIFIED ANALYSIS - Preset mode results:', presetResults.map(r => `${r.pesticide}: ${r.testRGB.toFixed(0)}`));
    return { calibrationResults: presetResults, analysisResults };
  }
}
