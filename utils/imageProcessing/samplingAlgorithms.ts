import { calculateLuminance } from './brightness';
import {
  isValidPixelForManualClick,
  getPixelPriority,
  correctPremultipliedAlpha,
} from './pixelValidation';
import type { PixelData, SamplingResult, PixelWithPriority } from './types';

/**
 * Helper function to create error result
 */
function createErrorResult(
  pesticideName: string,
  centerX: number,
  centerY: number,
  errorMessage: string
): SamplingResult {
  return {
    pesticide: pesticideName,
    centerPoint: { x: centerX, y: centerY, width: 0, height: 0 },
    samplingArea: { x: 0, y: 0, width: 0, height: 0 },
    pixels: [],
    averageBrightness: 0,
    validPixels: 0,
    totalPixels: 0,
    invalidPixelsFiltered: 0,
    samplingMethod: 'error_no_valid_pixels',
    errorMessage,
  };
}

/**
 * Manual pixel sampling at clicked coordinates
 */
export function samplePixelsAtClick(
  ctx: CanvasRenderingContext2D,
  clickX: number,
  clickY: number,
  canvasWidth: number,
  canvasHeight: number,
  sampleRadius: number = 10
): SamplingResult {
  const canvas = ctx.canvas;

  // Convert display coordinates to natural image coordinates with better precision
  const naturalX = Math.round((clickX / canvasWidth) * canvas.width);
  const naturalY = Math.round((clickY / canvasHeight) * canvas.height);

  // Define sampling area around clicked point
  const startX = Math.max(0, naturalX - sampleRadius);
  const endX = Math.min(canvas.width, naturalX + sampleRadius);
  const startY = Math.max(0, naturalY - sampleRadius);
  const endY = Math.min(canvas.height, naturalY + sampleRadius);

  const areaWidth = endX - startX;
  const areaHeight = endY - startY;

  if (areaWidth <= 0 || areaHeight <= 0) {
    return createErrorResult(
      'Manual Click',
      clickX / canvasWidth,
      clickY / canvasHeight,
      'Invalid sampling area'
    );
  }

  const imageData = ctx.getImageData(startX, startY, areaWidth, areaHeight);
  const data = imageData.data;

  const validPixels: PixelWithPriority[] = [];
  let invalidPixelsFiltered = 0;

  // Sample pixels in the area
  for (let y = 0; y < areaHeight; y++) {
    for (let x = 0; x < areaWidth; x++) {
      const dataIndex = (y * areaWidth + x) * 4;
      const rRaw = data[dataIndex];
      const gRaw = data[dataIndex + 1];
      const bRaw = data[dataIndex + 2];
      const a = data[dataIndex + 3];

      // Apply alpha correction if needed
      const { r, g, b } = correctPremultipliedAlpha(rRaw, gRaw, bRaw, a);

      // Ultra-lenient validation for manual sampling - only exclude pure black
      if (isValidPixelForManualClick(r, g, b)) {
        const brightness = calculateLuminance(r, g, b);
        const priority = getPixelPriority(r, g, b);

        const pixelData: PixelWithPriority = {
          x: startX + x,
          y: startY + y,
          r,
          g,
          b,
          brightness,
          priority,
        };

        validPixels.push(pixelData);
      } else {
        invalidPixelsFiltered++;
      }
    }
  }

  // Sort by priority and take top pixels
  validPixels.sort((a, b) => b.priority - a.priority);
  const selectedPixels = validPixels.slice(0, Math.min(25, validPixels.length));

  const pixels: PixelData[] = selectedPixels.map(p => ({
    x: p.x,
    y: p.y,
    r: p.r,
    g: p.g,
    b: p.b,
    brightness: p.brightness,
  }));

  const validPixelsCount = pixels.length;
  const totalBrightness = pixels.reduce((sum, p) => sum + p.brightness, 0);
  const averageBrightness =
    validPixelsCount > 0 ? totalBrightness / validPixelsCount : 0;

  return {
    pesticide: 'Manual Click',
    centerPoint: {
      x: clickX / canvasWidth,
      y: clickY / canvasHeight,
      width: 0,
      height: 0,
    },
    samplingArea: {
      x: startX / canvas.width,
      y: startY / canvas.height,
      width: areaWidth / canvas.width,
      height: areaHeight / canvas.height,
    },
    pixels,
    averageBrightness,
    validPixels: validPixelsCount,
    totalPixels: areaWidth * areaHeight,
    invalidPixelsFiltered,
    samplingMethod: 'expanded_spiral',
  };
}

/**
 * Sample RGB values from specific pixel coordinates with 5-pixel sampling
 * This replaces the ROI-based detection with direct coordinate sampling
 * Samples center pixel + 4 nearby pixels (cross pattern) for better accuracy
 */
export function samplePixelsAtCoordinates(
  ctx: CanvasRenderingContext2D,
  coordinates: Array<{ name: string; x: number; y: number }>
): SamplingResult[] {
  const canvas = ctx.canvas;

  // Log the coordinates being used for pixel sampling
  console.log('🎯 Pixel sampling coordinates:', coordinates);

  return coordinates.map(coord => {
    try {
      // Ensure coordinates are within canvas bounds
      const centerX = Math.max(0, Math.min(canvas.width - 1, coord.x));
      const centerY = Math.max(0, Math.min(canvas.height - 1, coord.y));

      // Define 5-pixel sampling pattern: center + 4 nearby pixels (cross pattern)
      const samplingOffsets = [
        { x: 0, y: 0 }, // Center pixel
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 }, // Right
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 }, // Down
      ];

      const pixels: PixelWithPriority[] = [];
      let totalR = 0,
        totalG = 0,
        totalB = 0,
        totalBrightness = 0;
      let validPixelsCount = 0;

      // Sample each pixel in the pattern
      samplingOffsets.forEach(offset => {
        const pixelX = centerX + offset.x;
        const pixelY = centerY + offset.y;

        // Ensure pixel is within canvas bounds
        if (
          pixelX >= 0 &&
          pixelX < canvas.width &&
          pixelY >= 0 &&
          pixelY < canvas.height
        ) {
          // Get pixel data
          const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
          const data = imageData.data;

          const rRaw = data[0];
          const gRaw = data[1];
          const bRaw = data[2];
          const a = data[3];

          // Apply alpha correction if needed
          const { r, g, b } = correctPremultipliedAlpha(rRaw, gRaw, bRaw, a);

          // Calculate brightness using luminance formula
          const brightness = calculateLuminance(r, g, b);

          // Create pixel result
          const pixel: PixelWithPriority = {
            x: pixelX / canvas.width,
            y: pixelY / canvas.height,
            r,
            g,
            b,
            brightness,
            priority: getPixelPriority(r, g, b),
          };

          pixels.push(pixel);
          totalR += r;
          totalG += g;
          totalB += b;
          totalBrightness += brightness;
          validPixelsCount++;
        }
      });

      // Calculate averages
      const averageR = validPixelsCount > 0 ? totalR / validPixelsCount : 0;
      const averageG = validPixelsCount > 0 ? totalG / validPixelsCount : 0;
      const averageB = validPixelsCount > 0 ? totalB / validPixelsCount : 0;
      const averageBrightness =
        validPixelsCount > 0 ? totalBrightness / validPixelsCount : 0;

      return {
        pesticide: coord.name,
        centerPoint: {
          x: centerX / canvas.width,
          y: centerY / canvas.height,
          width: 0,
          height: 0,
        },
        samplingArea: {
          x: (centerX - 1) / canvas.width,
          y: (centerY - 1) / canvas.height,
          width: 3 / canvas.width,
          height: 3 / canvas.height,
        },
        pixels,
        averageR,
        averageG,
        averageB,
        averageBrightness,
        validPixels: validPixelsCount,
        totalPixels: 5,
        invalidPixelsFiltered: 5 - validPixelsCount,
        samplingMethod: 'coordinate_based',
      };
    } catch (error) {
      return createErrorResult(
        coord.name,
        coord.x / canvas.width,
        coord.y / canvas.height,
        `Error sampling coordinate: ${error}`
      );
    }
  });
}
