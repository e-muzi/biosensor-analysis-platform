/**
 * Image cropping utilities
 */

export interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Crop image data to test kit bounds and return as data URL
 */
export async function cropToTestKit(
  imageData: ImageData,
  cropBounds: CropBounds
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { 
        premultipliedAlpha: false,
        willReadFrequently: true 
      }) as CanvasRenderingContext2D;
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas dimensions to crop bounds
      canvas.width = cropBounds.width;
      canvas.height = cropBounds.height;
      
      // Draw the cropped portion of the image
      ctx.putImageData(imageData, -cropBounds.x, -cropBounds.y);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Crop image data to specified bounds
 */
export function cropImageData(
  imageData: ImageData,
  cropBounds: CropBounds
): ImageData {
  const { x, y, width, height } = cropBounds;
  
  // Create new image data for the cropped area
  const croppedData = new ImageData(width, height);
  
  // Copy pixel data from the original image data
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const sourceIndex = ((y + row) * imageData.width + (x + col)) * 4;
      const targetIndex = (row * width + col) * 4;
      
      // Copy RGBA values
      croppedData.data[targetIndex] = imageData.data[sourceIndex];     // R
      croppedData.data[targetIndex + 1] = imageData.data[sourceIndex + 1]; // G
      croppedData.data[targetIndex + 2] = imageData.data[sourceIndex + 2]; // B
      croppedData.data[targetIndex + 3] = imageData.data[sourceIndex + 3]; // A
    }
  }
  
  return croppedData;
}
