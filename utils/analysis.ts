// Main analysis module - re-exports all analysis functions

// Basic analysis functions
export * from "./analysis/brightnessAnalysis";
export * from "./analysis/calibrationAnalysis";
export * from "./analysis/brightnessCalculations";
export * from "./analysis/imageCropping";
export * from "./analysis/testDetection";

// Constants
export * from "./constants/roiConstants";

// Image processing functions (needed for analysis)
export { detectTestKitBoundariesAdvanced } from "./imageProcessing/detectionAlgorithms";

// Unified analysis
export * from "./analysis/unifiedAnalysis";

// Normalization analysis (with specific exports to avoid conflicts)
export {
  calculateMultipleBrightness as calculateNormalizationBrightness,
  WHITE_REFERENCE_ROI,
  PESTICIDE_ROIS as NORMALIZATION_PESTICIDE_ROIS
} from "./analysis/normalizationAnalysis";
