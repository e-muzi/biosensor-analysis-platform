export interface CalibrationPoint {
  concentration: number;
  brightness: number;
}

export interface AnalysisResult {
  pesticide: string;
  brightness: number;
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
  testBrightness: number;
  calibrationBrightnesses: number[];
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