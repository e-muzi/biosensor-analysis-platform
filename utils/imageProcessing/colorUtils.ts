// Converts RGB color to HSV. Returns V (value/brightness) component.
export function rgbToHsv_V(r: number, g: number, b: number): number {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  return max * 255; // Return V component on a 0-255 scale
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
