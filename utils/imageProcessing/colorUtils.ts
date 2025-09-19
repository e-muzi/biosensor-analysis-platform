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
  let validPixelCount = 0;

  // Filter out black/very dark pixels and focus on colored areas
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const brightness = rgbToHsv_V(r, g, b);
    
    // Only include pixels that are not pure black and have some color
    if (brightness > 10 && (r > 5 || g > 5 || b > 5)) {
      totalBrightness += brightness;
      validPixelCount++;
    }
  }
  
  // If no valid pixels found, fall back to including all pixels
  if (validPixelCount === 0) {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const brightness = rgbToHsv_V(r, g, b);
      totalBrightness += brightness;
      validPixelCount++;
    }
  }
  
  return totalBrightness / validPixelCount;
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
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate brightness
    const brightness = (0.299 * r) + (0.587 * g) + (0.114 * b);
    
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
    console.log(`Debug: No valid colored pixels found, falling back to all pixels`);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      totalR += r;
      totalG += g;
      totalB += b;
      validPixelCount++;
    }
  } else {
    console.log(`Debug: Found ${validPixelCount} valid colored pixels out of ${data.length / 4} total pixels`);
  }
  
  return {
    r: Math.round(totalR / validPixelCount),
    g: Math.round(totalG / validPixelCount),
    b: Math.round(totalB / validPixelCount)
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
