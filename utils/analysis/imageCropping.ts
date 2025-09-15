import { detectTestKitBoundaries, detectTestKitBoundariesAdvanced } from "../imageProcessing/detectionAlgorithms";

// Crop image to detected test kit area
export function cropToTestKit(
  originalImageData: ImageData, 
  detectedBounds: { x: number; y: number; width: number; height: number; }, 
  image: HTMLImageElement
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Set canvas to image size
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      
      // Draw the full image
      ctx.drawImage(image, 0, 0);
      
      // Get image data for detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Try advanced detection first, then fallback to simple detection
      let boundaries = detectTestKitBoundariesAdvanced(imageData);
      
      if (!boundaries) {
        console.log("Advanced detection failed, trying simple detection");
        boundaries = detectTestKitBoundaries(imageData);
      }
      
      if (!boundaries) {
        console.warn("Could not detect test kit, using fallback crop");
        // Fallback to center crop with reasonable test kit proportions
        const fallbackWidth = Math.floor(canvas.width * 0.85);
        const fallbackHeight = Math.floor(canvas.height * 0.85);
        const fallbackX = Math.floor((canvas.width - fallbackWidth) / 2);
        const fallbackY = Math.floor((canvas.height - fallbackHeight) / 2);
        
        boundaries = {
          x: fallbackX,
          y: fallbackY,
          width: fallbackWidth,
          height: fallbackHeight
        };
      }
      
      // Create new canvas for cropped image
      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d");
      
      if (!croppedCtx) {
        reject(new Error("Could not get cropped canvas context"));
        return;
      }
      
      croppedCanvas.width = boundaries.width;
      croppedCanvas.height = boundaries.height;
      
      // Draw the cropped area
      croppedCtx.drawImage(
        canvas,
        boundaries.x, boundaries.y, boundaries.width, boundaries.height,
        0, 0, boundaries.width, boundaries.height
      );
      
      const dataUrl = croppedCanvas.toDataURL("image/jpeg", 0.9);
      resolve(dataUrl);
      
    } catch (error) {
      reject(error);
    }
  });
}
