// Re-export brightness functions from the new brightness module
export { rgbToLuminance, calculateBrightnessForRoi } from './brightness';
import { correctPremultipliedAlpha } from './pixelValidation';

// Alternative: Maximum RGB value
export function rgbToMax(r: number, g: number, b: number): number {
  return Math.max(r, g, b);
}

// Calculate average RGB values for a given region of interest
export function calculateAverageRGBForRoi(
  ctx: CanvasRenderingContext2D,
  roi: { x: number; y: number; width: number; height: number }
): { r: number; g: number; b: number } {
  const canvas = ctx.canvas;
  const roiX = Math.floor(canvas.width * roi.x);
  const roiY = Math.floor(canvas.height * roi.y);
  const roiWidth = Math.floor(canvas.width * roi.width);
  const roiHeight = Math.floor(canvas.height * roi.height);

  if (roiWidth <= 0 || roiHeight <= 0) return { r: 0, g: 0, b: 0 };

  const imageData = ctx.getImageData(roiX, roiY, roiWidth, roiHeight);
  const data = imageData.data;

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let validPixelCount = 0;

  // Filter out black/very dark pixels and focus on colored areas
  for (let i = 0; i < data.length; i += 4) {
    const rRaw = data[i];
    const gRaw = data[i + 1];
    const bRaw = data[i + 2];
    const a = data[i + 3];

    // Apply alpha correction if needed
    const { r, g, b } = correctPremultipliedAlpha(rRaw, gRaw, bRaw, a);

    // Calculate brightness using luminance formula
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    // Only include pixels that are not pure black and have some color
    // This filters out background/black areas and focuses on colored test strips
    if (brightness > 10 && (r > 5 || g > 5 || b > 5)) {
      totalR += r;
      totalG += g;
      totalB += b;
      validPixelCount++;
    }
  }

  // If no valid pixels found, fall back to including all pixels
  if (validPixelCount === 0) {
    console.log(
      `Debug: No valid colored pixels found, falling back to all pixels`
    );
    for (let i = 0; i < data.length; i += 4) {
      const rRaw = data[i];
      const gRaw = data[i + 1];
      const bRaw = data[i + 2];
      const a = data[i + 3];

      // Apply alpha correction if needed
      const { r, g, b } = correctPremultipliedAlpha(rRaw, gRaw, bRaw, a);

      totalR += r;
      totalG += g;
      totalB += b;
      validPixelCount++;
    }
  } else {
    console.log(
      `Debug: Found ${validPixelCount} valid colored pixels out of ${data.length / 4} total pixels`
    );
  }

  return {
    r: Math.round(totalR / validPixelCount),
    g: Math.round(totalG / validPixelCount),
    b: Math.round(totalB / validPixelCount),
  };
}

// Calculate RGB distance between two colors
export function calculateRGBDistance(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number {
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}
