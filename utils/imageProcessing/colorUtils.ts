// Calculate true brightness using luminance formula (weighted average)
export function rgbToHsv_V(r: number, g: number, b: number): number {
  // Use standard luminance formula: 0.299*R + 0.587*G + 0.114*B
  // This gives a more accurate representation of perceived brightness
  const brightness = (0.299 * r) + (0.587 * g) + (0.114 * b);
  return Math.round(brightness);
}

// Alternative: HSV V component (maximum RGB value)
export function rgbToHsv_V_Max(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  return max * 255;
}

// Calculate brightness for a given region of interest
export function calculateBrightnessForRoi(
  ctx: CanvasRenderingContext2D, 
  roi: { x: number; y: number; width: number; height: number }
): number {
  const canvas = ctx.canvas;
  const roiX = Math.floor(canvas.width * roi.x);
  const roiY = Math.floor(canvas.height * roi.y);
  const roiWidth = Math.floor(canvas.width * roi.width);
  const roiHeight = Math.floor(canvas.height * roi.height);
  
  if (roiWidth <= 0 || roiHeight <= 0) return 0;

  const imageData = ctx.getImageData(roiX, roiY, roiWidth, roiHeight);
  const data = imageData.data;
  
  let totalBrightness = 0;
  let pixelCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const brightness = rgbToHsv_V(r, g, b);
    totalBrightness += brightness;
    pixelCount++;
  }
  
  return totalBrightness / pixelCount;
}
