// Estimate concentration by comparing test RGB with calibration RGB values
export function estimateConcentrationFromCalibration(
  testRGB: number,
  calibrationRGBs: number[],
  concentrations: number[]
): { concentration: number; confidence: 'high' | 'medium' | 'low' } {
  // For biosensors, higher concentrations typically result in darker colors (lower RGB values)
  // therefore it is an inverse relationship between RGB and concentration

  // Step 1: Find the two calibration points that bracket the test RGB
  let lowerIndex = 0;
  let upperIndex = calibrationRGBs.length - 1;

  // Step 2: Check if RGB values are in ascending or descending order
  const isAscending =
    calibrationRGBs[0] < calibrationRGBs[calibrationRGBs.length - 1];

  if (isAscending) {
    // RGB increases with concentration (normal case)
    for (let i = 0; i < calibrationRGBs.length - 1; i++) {
      if (testRGB >= calibrationRGBs[i] && testRGB <= calibrationRGBs[i + 1]) {
        lowerIndex = i;
        upperIndex = i + 1;
        break;
      }
    }

    // If test RGB is outside the calibration range
    if (testRGB < calibrationRGBs[0]) {
      return { concentration: concentrations[0], confidence: 'low' };
    }
    if (testRGB > calibrationRGBs[calibrationRGBs.length - 1]) {
      return {
        concentration: concentrations[concentrations.length - 1],
        confidence: 'low',
      };
    }
  } else {
    // RGB decreases with concentration (biosensor case)
    for (let i = 0; i < calibrationRGBs.length - 1; i++) {
      if (testRGB <= calibrationRGBs[i] && testRGB >= calibrationRGBs[i + 1]) {
        lowerIndex = i;
        upperIndex = i + 1;
        break;
      }
    }

    // If test RGB is outside the calibration range
    if (testRGB > calibrationRGBs[0]) {
      return { concentration: concentrations[0], confidence: 'low' };
    }
    if (testRGB < calibrationRGBs[calibrationRGBs.length - 1]) {
      return {
        concentration: concentrations[concentrations.length - 1],
        confidence: 'low',
      };
    }
  }

  // Step 3: Linear interpolation formular
  const lowerRGB = calibrationRGBs[lowerIndex];
  const upperRGB = calibrationRGBs[upperIndex];
  const lowerConcentration = concentrations[lowerIndex];
  const upperConcentration = concentrations[upperIndex];

  if (upperRGB === lowerRGB) {
    return { concentration: lowerConcentration, confidence: 'medium' };
  }

  const concentration =
    lowerConcentration +
    ((testRGB - lowerRGB) * (upperConcentration - lowerConcentration)) /
      (upperRGB - lowerRGB);

  // Step 4: Calculate confidence based on how close we are to calibration points
  const rgbRange = Math.abs(upperRGB - lowerRGB);
  const rgbDiff = Math.abs(testRGB - lowerRGB);
  const ratio = rgbDiff / rgbRange;

  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (ratio < 0.3 || ratio > 0.7) {
    confidence = 'high'; // Close to a calibration point
  } else if (ratio < 0.1 || ratio > 0.9) {
    confidence = 'low'; // Far from calibration points
  }

  return { concentration, confidence };
}

// Estimate concentration by comparing test RGB with calibration RGB values
export function estimateConcentrationFromRGB(
  testRGB: number, // Total RGB value (R + G + B)
  calibrationCurve: Array<{ concentration: number; rgb: number }>
): { concentration: number; confidence: 'high' | 'medium' | 'low' } {
  // Use RGB values directly for comparison
  const calibrationRGBs = calibrationCurve.map(point => point.rgb);
  const concentrations = calibrationCurve.map(point => point.concentration);

  // Use RGB-based interpolation
  return estimateConcentrationFromCalibration(
    testRGB,
    calibrationRGBs,
    concentrations
  );
}
