import { MovableDot } from '../../components/analyze/alignment/hooks/useMovableDots';

/**
 * Convert movable dot positions (percentages) to pixel coordinates
 * for use in analysis functions
 */
export function convertDotPositionsToCoordinates(
  dots: MovableDot[],
  imageWidth: number,
  imageHeight: number
): Array<{ name: string; x: number; y: number }> {
  return dots.map(dot => ({
    name: dot.name,
    x: Math.round(dot.position.x * imageWidth),
    y: Math.round(dot.position.y * imageHeight),
  }));
}

/**
 * Convert pixel coordinates back to percentage positions
 * for use in UI components
 */
export function convertCoordinatesToDotPositions(
  coordinates: Array<{ name: string; x: number; y: number }>,
  imageWidth: number,
  imageHeight: number
): MovableDot[] {
  return coordinates.map(coord => ({
    name: coord.name,
    position: {
      x: coord.x / imageWidth,
      y: coord.y / imageHeight,
    },
  }));
}
