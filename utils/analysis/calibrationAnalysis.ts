// Estimate concentration by comparing test brightness with calibration strip
export function estimateConcentrationFromCalibration(
  testBrightness: number, 
  calibrationBrightnesses: number[], 
  concentrations: number[]
): { concentration: number; confidence: "high" | "medium" | "low" } {
  
  // For biosensors, higher concentrations typically result in darker colors (lower brightness)
  // So we need to handle the inverse relationship between brightness and concentration
  
  // Find the two calibration points that bracket the test brightness
  let lowerIndex = 0;
  let upperIndex = calibrationBrightnesses.length - 1;
  
  // Check if brightness values are in ascending or descending order
  const isAscending = calibrationBrightnesses[0] < calibrationBrightnesses[calibrationBrightnesses.length - 1];
  
  if (isAscending) {
    // Brightness increases with concentration (normal case)
    for (let i = 0; i < calibrationBrightnesses.length - 1; i++) {
      if (testBrightness >= calibrationBrightnesses[i] && testBrightness <= calibrationBrightnesses[i + 1]) {
        lowerIndex = i;
        upperIndex = i + 1;
        break;
      }
    }
    
    // If test brightness is outside the calibration range
    if (testBrightness < calibrationBrightnesses[0]) {
      return { concentration: concentrations[0], confidence: "low" };
    }
    if (testBrightness > calibrationBrightnesses[calibrationBrightnesses.length - 1]) {
      return { concentration: concentrations[concentrations.length - 1], confidence: "low" };
    }
  } else {
    // Brightness decreases with concentration (biosensor case)
    for (let i = 0; i < calibrationBrightnesses.length - 1; i++) {
      if (testBrightness <= calibrationBrightnesses[i] && testBrightness >= calibrationBrightnesses[i + 1]) {
        lowerIndex = i;
        upperIndex = i + 1;
        break;
      }
    }
    
    // If test brightness is outside the calibration range
    if (testBrightness > calibrationBrightnesses[0]) {
      return { concentration: concentrations[0], confidence: "low" };
    }
    if (testBrightness < calibrationBrightnesses[calibrationBrightnesses.length - 1]) {
      return { concentration: concentrations[concentrations.length - 1], confidence: "low" };
    }
  }
  
  // Linear interpolation
  const lowerBrightness = calibrationBrightnesses[lowerIndex];
  const upperBrightness = calibrationBrightnesses[upperIndex];
  const lowerConcentration = concentrations[lowerIndex];
  const upperConcentration = concentrations[upperIndex];
  
  if (upperBrightness === lowerBrightness) {
    return { concentration: lowerConcentration, confidence: "medium" };
  }
  
  const concentration = lowerConcentration + 
    ((testBrightness - lowerBrightness) * (upperConcentration - lowerConcentration)) / 
    (upperBrightness - lowerBrightness);
  
  // Determine confidence based on how close we are to calibration points
  const brightnessRange = Math.abs(upperBrightness - lowerBrightness);
  const brightnessDiff = Math.abs(testBrightness - lowerBrightness);
  const ratio = brightnessDiff / brightnessRange;
  
  let confidence: "high" | "medium" | "low" = "medium";
  if (ratio < 0.3 || ratio > 0.7) {
    confidence = "high"; // Close to a calibration point
  } else if (ratio < 0.1 || ratio > 0.9) {
    confidence = "low"; // Far from calibration points
  }
  
  return { concentration, confidence };
}

// Estimate concentration by comparing test RGB with calibration RGB values
export function estimateConcentrationFromRGB(
  testRGB: { r: number; g: number; b: number },
  calibrationCurve: Array<{ concentration: number; rgb: { r: number; g: number; b: number } }>
): { concentration: number; confidence: "high" | "medium" | "low" } {
  
  // Calculate brightness for the test RGB
  const testBrightness = (0.299 * testRGB.r) + (0.587 * testRGB.g) + (0.114 * testRGB.b);
  
  // Calculate brightness for each calibration point
  const calibrationBrightnesses = calibrationCurve.map(point => 
    (0.299 * point.rgb.r) + (0.587 * point.rgb.g) + (0.114 * point.rgb.b)
  );
  
  const concentrations = calibrationCurve.map(point => point.concentration);
  
  // Use brightness-based interpolation instead of RGB distance
  return estimateConcentrationFromCalibration(testBrightness, calibrationBrightnesses, concentrations);
}
