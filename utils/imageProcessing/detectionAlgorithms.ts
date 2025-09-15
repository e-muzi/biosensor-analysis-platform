// Function to detect test kit boundaries by finding white background with improved edge detection
export function detectTestKitBoundaries(imageData: ImageData): { x: number; y: number; width: number; height: number } | null {
  const { data, width, height } = imageData;
  
  // Threshold for white detection (adjust as needed)
  const whiteThreshold = 180; // RGB values above this are considered white
  const minWhitePixels = 50; // Minimum consecutive white pixels to consider as border
  
  // Function to check if a pixel is white
  const isWhitePixel = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const index = (y * width + x) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    return r > whiteThreshold && g > whiteThreshold && b > whiteThreshold;
  };
  
  // Function to find the first non-white pixel from a given direction
  const findEdge = (startX: number, startY: number, direction: "left" | "right" | "top" | "bottom"): number => {
    let x = startX;
    let y = startY;
    let consecutiveWhite = 0;
    
    while (x >= 0 && x < width && y >= 0 && y < height) {
      if (isWhitePixel(x, y)) {
        consecutiveWhite++;
        if (consecutiveWhite >= minWhitePixels) {
          // We found a white border, now look for the edge
          while (x >= 0 && x < width && y >= 0 && y < height) {
            if (!isWhitePixel(x, y)) {
              // Found the edge, go back to the last white pixel
              switch (direction) {
                case "left": return x + 1;
                case "right": return x - 1;
                case "top": return y + 1;
                case "bottom": return y - 1;
              }
            }
            switch (direction) {
              case "left": x--; break;
              case "right": x++; break;
              case "top": y--; break;
              case "bottom": y++; break;
            }
          }
        }
      } else {
        consecutiveWhite = 0;
      }
      
      switch (direction) {
        case "left": x--; break;
        case "right": x++; break;
        case "top": y--; break;
        case "bottom": y++; break;
      }
    }
    
    // If we did not find a clear edge, use the original position
    switch (direction) {
      case "left": return 0;
      case "right": return width - 1;
      case "top": return 0;
      case "bottom": return height - 1;
    }
  };
  
  // Find edges from the center outward
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  const leftEdge = findEdge(centerX, centerY, "left");
  const rightEdge = findEdge(centerX, centerY, "right");
  const topEdge = findEdge(centerX, centerY, "top");
  const bottomEdge = findEdge(centerX, centerY, "bottom");
  
  // Calculate boundaries
  const cropX = Math.max(0, leftEdge);
  const cropY = Math.max(0, topEdge);
  const cropWidth = Math.min(width - cropX, rightEdge - leftEdge);
  const cropHeight = Math.min(height - cropY, bottomEdge - topEdge);
  
  // Validate the detected area
  if (cropWidth < 50 || cropHeight < 50) {
    console.warn("Detected test kit area too small, using fallback");
    return null;
  }
  
  // Check if the detected area has a reasonable aspect ratio (test kits are typically rectangular)
  const aspectRatio = cropWidth / cropHeight;
  if (aspectRatio < 0.5 || aspectRatio > 3) {
    console.warn("Detected test kit has unusual aspect ratio, using fallback");
    return null;
  }
  
  console.log("Detected test kit boundaries:", { 
    x: cropX, y: cropY, width: cropWidth, height: cropHeight,
    aspectRatio: aspectRatio.toFixed(2)
  });
  
  return { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
}


// Alternative function using contour detection for more accurate test kit detection
export function detectTestKitBoundariesAdvanced(imageData: ImageData): { x: number; y: number; width: number; height: number } | null {
  const { data, width, height } = imageData;
  
  // Convert to grayscale and create binary mask
  const mask = new Uint8Array(width * height);
  const whiteThreshold = 180;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      
      // Create binary mask: 1 for white pixels, 0 for others
      mask[y * width + x] = (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) ? 1 : 0;
    }
  }
  
  // Find the largest connected white region (the test kit)
  const visited = new Set<number>();
  let largestRegion: number[] = [];
  
  const floodFill = (startX: number, startY: number): number[] => {
    const stack: [number, number][] = [[startX, startY]];
    const region: number[] = [];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const index = y * width + x;
      
      if (x < 0 || x >= width || y < 0 || y >= height || visited.has(index) || mask[index] === 0) {
        continue;
      }
      
      visited.add(index);
      region.push(index);
      
      // Add neighbors
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    return region;
  };
  
  // Find all connected regions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (!visited.has(index) && mask[index] === 1) {
        const region = floodFill(x, y);
        if (region.length > largestRegion.length) {
          largestRegion = region;
        }
      }
    }
  }
  
  if (largestRegion.length === 0) {
    console.warn("No white regions detected");
    return null;
  }
  
  // Calculate bounding box of the largest region
  let minX = width, maxX = 0, minY = height, maxY = 0;
  
  for (const index of largestRegion) {
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  
  // Add padding
  const padding = 5;
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropWidth = Math.min(width - cropX, maxX - minX + 2 * padding);
  const cropHeight = Math.min(height - cropY, maxY - minY + 2 * padding);
  
  console.log("Advanced detection - test kit boundaries:", { 
    x: cropX, y: cropY, width: cropWidth, height: cropHeight,
    regionSize: largestRegion.length
  });
  
  return { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
}
