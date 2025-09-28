import { calculateAverageRGBForRoi } from "../imageProcessing/colorUtils";
import type { CalibrationStrip } from "../../types";


// Calculate RGB values for each segment of a vertical calibration strip
// strip mode only
export function calculateCalibrationStripRGBs(
  ctx: CanvasRenderingContext2D, 
  strip: CalibrationStrip
): number[] {
  const canvas = ctx.canvas;
  const stripY = Math.floor(canvas.height * strip.roi.y);
  const stripWidth = Math.floor(canvas.width * strip.roi.width);
  const stripHeight = Math.floor(canvas.height * strip.roi.height);
  
  if (stripWidth <= 0 || stripHeight <= 0) return [0, 0, 0, 0, 0];

  const segmentHeight = stripHeight / 5; // 5 vertical segments
  const rgbValues: number[] = [];

  for (let i = 0; i < 5; i++) {
    const segmentY = stripY + (i * segmentHeight);
    const segmentROI = {
      x: strip.roi.x,
      y: segmentY / canvas.height,
      width: strip.roi.width,
      height: segmentHeight / canvas.height
    };
    const { r, g, b } = calculateAverageRGBForRoi(ctx, segmentROI);
    rgbValues.push(r + g + b); // Total RGB value
  }

  return rgbValues;
}
