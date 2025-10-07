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
 * Crop image data to specified bounds
 */
export function cropImageData(
  imageData: ImageData,
  cropBounds: CropBounds
): ImageData {
  const { x, y, width, height } = cropBounds;

  const croppedData = new ImageData(width, height);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const sourceIndex = ((y + row) * imageData.width + (x + col)) * 4;
      const targetIndex = (row * width + col) * 4;

      croppedData.data[targetIndex] = imageData.data[sourceIndex];
      croppedData.data[targetIndex + 1] = imageData.data[sourceIndex + 1];
      croppedData.data[targetIndex + 2] = imageData.data[sourceIndex + 2];
      croppedData.data[targetIndex + 3] = imageData.data[sourceIndex + 3];
    }
  }

  return croppedData;
}
