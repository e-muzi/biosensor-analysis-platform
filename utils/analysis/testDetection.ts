import { detectTestKitBoundaries, detectTestKitBoundariesAdvanced } from "../imageProcessing/detectionAlgorithms";

// Test function to verify test kit detection
export function testTestKitDetection(imageData: ImageData): {
  simpleDetection: { x: number; y: number; width: number; height: number } | null;
  advancedDetection: { x: number; y: number; width: number; height: number } | null;
  debugInfo: {
    imageWidth: number;
    imageHeight: number;
    whitePixelCount: number;
    totalPixels: number;
    whitePercentage: number;
  };
} {
  const { data, width, height } = imageData;
  const whiteThreshold = 180;
  
  let whitePixelCount = 0;
  const totalPixels = width * height;
  
  // Count white pixels for debugging
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
      whitePixelCount++;
    }
  }
  
  const debugInfo = {
    imageWidth: width,
    imageHeight: height,
    whitePixelCount,
    totalPixels,
    whitePercentage: (whitePixelCount / totalPixels) * 100
  };
  
  // Test both detection methods
  const simpleDetection = detectTestKitBoundaries(imageData);
  const advancedDetection = detectTestKitBoundariesAdvanced(imageData);
  
  console.log("Test Kit Detection Results:", {
    debugInfo,
    simpleDetection,
    advancedDetection
  });
  
  return {
    simpleDetection,
    advancedDetection,
    debugInfo
  };
}
