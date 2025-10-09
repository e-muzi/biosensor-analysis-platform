// Pesticide-specific concentration thresholds for Preset mode
// Values are in mg/L (milligrams per liter)

export interface PesticideThresholds {
  low: { min: number; max: number };
  medium: { min: number; max: number };
  high: { min: number; max: number };
}

export const PESTICIDE_THRESHOLDS: Record<string, PesticideThresholds> = {
  'Acephate': {
    low: { min: 0.01, max: 0.1 },
    medium: { min: 0.1, max: 0.5 },
    high: { min: 0.5, max: 1.0 }
  },
  'Glyphosate': {
    low: { min: 0.1, max: 0.3 },
    medium: { min: 0.3, max: 0.7 },
    high: { min: 0.7, max: 1.0 }
  },
  'Malathion': {
    low: { min: 0.1, max: 0.4 },
    medium: { min: 0.4, max: 0.8 },
    high: { min: 0.8, max: 1.0 }
  },
  'Chlorpyrifos': {
    low: { min: 0.01, max: 0.05 },
    medium: { min: 0.05, max: 0.1 },
    high: { min: 0.1, max: 1.0 }
  },
  'Acetamiprid': {
    low: { min: 0.01, max: 0.1 },
    medium: { min: 0.1, max: 0.5 },
    high: { min: 0.5, max: 1.0 }
  }
};

// Default thresholds for Strip mode (original µM values converted to mg/L)
// Using approximate conversion: 1 µM ≈ 0.1 mg/L for most pesticides
const DEFAULT_THRESHOLDS: PesticideThresholds = {
  low: { min: 0, max: 0.01 }, // < 0.1 µM
  medium: { min: 0.01, max: 0.1 }, // 0.1 - 1.0 µM  
  high: { min: 0.1, max: 1.0 } // ≥ 1.0 µM
};

export function getConcentrationLabel(
  concentration: number,
  pesticide: string,
  detectionMode: 'preset' | 'strip'
): string {
  const thresholds = detectionMode === 'preset' 
    ? PESTICIDE_THRESHOLDS[pesticide] || DEFAULT_THRESHOLDS
    : DEFAULT_THRESHOLDS;

  if (concentration >= thresholds.low.min && concentration < thresholds.low.max) {
    return 'Low';
  }
  if (concentration >= thresholds.medium.min && concentration < thresholds.medium.max) {
    return 'Medium';
  }
  if (concentration >= thresholds.high.min && concentration <= thresholds.high.max) {
    return 'High';
  }
  
  // Handle edge cases
  if (concentration < thresholds.low.min) return 'Low';
  if (concentration > thresholds.high.max) return 'High';
  
  return 'Medium'; // fallback
}

export function getConcentrationColor(
  concentration: number,
  pesticide: string,
  detectionMode: 'preset' | 'strip'
): 'success' | 'warning' | 'error' {
  const thresholds = detectionMode === 'preset' 
    ? PESTICIDE_THRESHOLDS[pesticide] || DEFAULT_THRESHOLDS
    : DEFAULT_THRESHOLDS;

  if (concentration >= thresholds.low.min && concentration < thresholds.low.max) {
    return 'success';
  }
  if (concentration >= thresholds.medium.min && concentration < thresholds.medium.max) {
    return 'warning';
  }
  if (concentration >= thresholds.high.min && concentration <= thresholds.high.max) {
    return 'error';
  }
  
  // Handle edge cases
  if (concentration < thresholds.low.min) return 'success';
  if (concentration > thresholds.high.max) return 'error';
  
  return 'warning'; // fallback
}
