import { calculateAverageRGBForRoi } from '../imageProcessing/colorUtils';
import type { CalibrationStrip } from '../../types';

// Calculate RGB values for each segment of a horizontal calibration strip
// strip mode only - updated for 3-point calibration
export function calculateCalibrationStripRGBs(
  ctx: CanvasRenderingContext2D,
  strip: CalibrationStrip
): number[] {
  const canvas = ctx.canvas;
  const stripX = Math.floor(canvas.width * strip.roi.x);
  const stripWidth = Math.floor(canvas.width * strip.roi.width);
  const stripHeight = Math.floor(canvas.height * strip.roi.height);

  if (stripWidth <= 0 || stripHeight <= 0) return [0, 0, 0];

  const segmentWidth = stripWidth / 3; // 3 horizontal segments for 3-point calibration
  const rgbValues: number[] = [];

  for (let i = 0; i < 3; i++) {
    const segmentX = stripX + i * segmentWidth;
    const segmentROI = {
      x: segmentX / canvas.width,
      y: strip.roi.y,
      width: segmentWidth / canvas.width,
      height: strip.roi.height,
    };
    const { r, g, b } = calculateAverageRGBForRoi(ctx, segmentROI);
    const totalRGB = r + g + b;
    rgbValues.push(totalRGB); // Total RGB value
    
    // Console log individual segment RGB values
    console.log(`📊 Calibration Strip Segment ${strip.name} - Segment ${i + 1}:`, {
      strip: strip.name,
      segment: i + 1,
      concentration: strip.concentrations[i],
      roi: segmentROI,
      pixelCoordinates: {
        x: segmentX,
        y: Math.floor(canvas.height * strip.roi.y),
        width: segmentWidth,
        height: Math.floor(canvas.height * strip.roi.height)
      },
      rgb: { r: Math.round(r), g: Math.round(g), b: Math.round(b) },
      totalRGB: Math.round(totalRGB)
    });
  }

  return rgbValues;
}
