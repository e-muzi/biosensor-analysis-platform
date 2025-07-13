import type { CalibrationPoint } from '../types';

export function interpolateConcentration(brightness: number, points: CalibrationPoint[]): number {
  if (points.length < 2) {
    return 0;
  }
  
  const sortedPointsByBrightness = [...points].sort((a, b) => a.brightness - b.brightness);

  if (brightness <= sortedPointsByBrightness[0].brightness) {
    return sortedPointsByBrightness[0].concentration;
  }
  if (brightness >= sortedPointsByBrightness[sortedPointsByBrightness.length - 1].brightness) {
    return sortedPointsByBrightness[sortedPointsByBrightness.length - 1].concentration;
  }

  // Find the two calibration points that bracket the measured brightness
  for (let i = 0; i < sortedPointsByBrightness.length - 1; i++) {
    if (brightness >= sortedPointsByBrightness[i].brightness && brightness <= sortedPointsByBrightness[i + 1].brightness) {
      const p1 = sortedPointsByBrightness[i];
      const p2 = sortedPointsByBrightness[i + 1];
      
      if (p2.brightness === p1.brightness) {
        return p1.concentration;
      }
      
      // Linear interpolation
      const concentration = p1.concentration + 
        ((brightness - p1.brightness) * (p2.concentration - p1.concentration)) / (p2.brightness - p1.brightness);
        
      return concentration;
    }
  }
  
  return 0; // Fallback (should not reach here with proper calibration data)
}
