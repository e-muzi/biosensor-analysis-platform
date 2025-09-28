export interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  brightness: number;
}

export interface SamplingResult {
  pesticide: string;
  centerPoint: { x: number; y: number; width: number; height: number };
  samplingArea: { x: number; y: number; width: number; height: number };
  pixels: PixelData[];
  averageBrightness: number;
  validPixels: number;
  totalPixels: number;
  invalidPixelsFiltered: number;
  samplingMethod:
    | 'spiral_outward'
    | 'expanded_spiral'
    | 'fallback_5pixel'
    | 'error_no_valid_pixels'
    | 'coordinate_based';
  errorMessage?: string;
}

export interface PixelWithPriority extends PixelData {
  priority: number;
}
