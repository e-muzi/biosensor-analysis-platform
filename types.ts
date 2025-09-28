export interface CalibrationPoint {
  concentration: number;
  rgb: number; // Total RGB value (R + G + B)
}

export interface AnalysisResult {
  pesticide: string;
  rgb: number; // Total RGB value (R + G + B)
  concentration: number;
  confidence?: 'high' | 'medium' | 'low';
}

// New types for calibration strip approach
export interface CalibrationStrip {
  name: string;
  roi: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  concentrations: number[]; // Known concentrations on the strip (left to right)
}

export interface CalibrationResult {
  pesticide: string;
  testRGB: number;
  calibrationRGBs: number[];
  estimatedConcentration: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface HistoryRecord {
  id: string;
  name: string;
  timestamp: string;
  imageSrc: string;
  results: AnalysisResult[];
}

export type Screen = 'capture' | 'history' | 'settings' | 'analysis' | 'alignment';
export interface PesticideROI {
  name: string;
  roi: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Detection mode types
export type DetectionMode = "calibration" | "normalization";

export interface ROI {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizationResult {
  name: string;
  brightness: number;
}
