import { calculateAverageRGBForRoi } from '../imageProcessing/colorUtils';
import type { CalibrationStrip } from '../../types';

// Calculate RGB values for each segment of a horizontal calibration strip
// strip mode only
export function calculateCalibrationStripRGBs(
  ctx: CanvasRenderingContext2D,
  strip: CalibrationStrip
): number[] {
  const canvas = ctx.canvas;
  const stripX = Math.floor(canvas.width * strip.roi.x);
  const stripWidth = Math.floor(canvas.width * strip.roi.width);
  const stripHeight = Math.floor(canvas.height * strip.roi.height);

  if (stripWidth <= 0 || stripHeight <= 0) return [0, 0, 0, 0, 0];

  const segmentWidth = stripWidth / 5; // 5 horizontal segments
  const rgbValues: number[] = [];

  for (let i = 0; i < 5; i++) {
    const segmentX = stripX + i * segmentWidth;
    const segmentROI = {
      x: segmentX / canvas.width,
      y: strip.roi.y,
      width: segmentWidth / canvas.width,
      height: strip.roi.height,
    };
    const { r, g, b } = calculateAverageRGBForRoi(ctx, segmentROI);
    rgbValues.push(r + g + b); // Total RGB value
  }

  return rgbValues;
}
