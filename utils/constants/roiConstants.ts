import { PREDEFINED_PESTICIDES } from '../../state/pesticideStore';
import type { CalibrationStrip } from '../../types';

// Defines a Region of Interest as a rectangle { x, y, width, height } in percentage
// Hardcoded ROI of the test kit

export interface ROI {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PesticideROI {
  name: string;
  roi: ROI;
}

// CORRECTED: Test kit layout constants now match the visual ROIs from the image.
export const TEST_KIT_LAYOUT = {
  // Calibration strip values updated for horizontal layout at bottom
  CALIBRATION_STRIP_WIDTH: 0.08,
  CALIBRATION_STRIP_HEIGHT: 0.06,
  // The following values are corrected based on the glowing samples.
  GAP_WIDTH: 0.09,
  TEST_AREA_WIDTH: 0.08,
  TEST_AREA_HEIGHT: 0.1,
  START_Y: 0.2,
} as const;

// Calibration strip configurations - 5 horizontal strips at bottom
export const CALIBRATION_STRIPS: CalibrationStrip[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name, // Acephate
    roi: { x: 0.21, y: 0.5, width: 0.08, height: 0.06 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (left to right)
  },
  {
    name: PREDEFINED_PESTICIDES[1].name, // Glyphosate
    roi: { x: 0.34, y: 0.5, width: 0.08, height: 0.06 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (left to right)
  },
  {
    name: PREDEFINED_PESTICIDES[2].name, // Malathion
    roi: { x: 0.46, y: 0.5, width: 0.08, height: 0.06 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (left to right)
  },
  {
    name: PREDEFINED_PESTICIDES[3].name, // Chlorpyrifos
    roi: { x: 0.59, y: 0.5, width: 0.08, height: 0.06 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (left to right)
  },
  {
    name: PREDEFINED_PESTICIDES[4].name, // Acetamiprid
    roi: { x: 0.72, y: 0.5, width: 0.08, height: 0.06 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (left to right)
  },
];

// Pesticide test area ROIs - 5 equal-width areas in the middle
// These are now reference rectangles for user visualization (green boxes)
export const PESTICIDE_ROIS: PesticideROI[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name,
    roi: { x: 0.21, y: 0.34, width: 0.08, height: 0.1 },
  }, // Acephate test area
  {
    name: PREDEFINED_PESTICIDES[1].name,
    roi: { x: 0.34, y: 0.34, width: 0.08, height: 0.1 },
  }, // Glyphosate test area
  {
    name: PREDEFINED_PESTICIDES[2].name,
    roi: { x: 0.46, y: 0.34, width: 0.08, height: 0.1 },
  }, // Malathion test area
  {
    name: PREDEFINED_PESTICIDES[3].name,
    roi: { x: 0.59, y: 0.34, width: 0.08, height: 0.1 },
  }, // Chlorpyrifos test area
  {
    name: PREDEFINED_PESTICIDES[4].name,
    roi: { x: 0.71, y: 0.34, width: 0.08, height: 0.1 },
  }, // Acetamiprid test area - moved left 3px
];

// Center points for 5-pixel sampling (center of each green box)
export const PESTICIDE_CENTER_POINTS: PesticideROI[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name,
    roi: { x: 0.25, y: 0.39, width: 0, height: 0 },
  }, // Acephate center
  {
    name: PREDEFINED_PESTICIDES[1].name,
    roi: { x: 0.38, y: 0.39, width: 0, height: 0 },
  }, // Glyphosate center
  {
    name: PREDEFINED_PESTICIDES[2].name,
    roi: { x: 0.5, y: 0.39, width: 0, height: 0 },
  }, // Malathion center
  {
    name: PREDEFINED_PESTICIDES[3].name,
    roi: { x: 0.63, y: 0.39, width: 0, height: 0 },
  }, // Chlorpyrifos center
  {
    name: PREDEFINED_PESTICIDES[4].name,
    roi: { x: 0.75, y: 0.39, width: 0, height: 0 },
  }, // Acetamiprid center - moved left 3px
];

// NEW: Specific pixel coordinates for direct sampling
export const PESTICIDE_COORDINATES = [
  { name: PREDEFINED_PESTICIDES[0].name, x: 81, y: 255 }, // Acephate - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[1].name, x: 163, y: 250 }, // Glyphosate - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[2].name, x: 248, y: 251 }, // Malathion - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[3].name, x: 333, y: 253 }, // Chlorpyrifos - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[4].name, x: 417, y: 252 }, // Acetamiprid - Updated to brighter green area, moved left 3px
];

// NEW: Capture mode analysis coordinates - 20 pixels downward from original positions
export const PESTICIDE_COORDINATES_CAPTURE_MODE = [
  { name: PREDEFINED_PESTICIDES[0].name, x: 81, y: 275 }, // Acephate - 20 pixels down from y: 255
  { name: PREDEFINED_PESTICIDES[1].name, x: 163, y: 270 }, // Glyphosate - 20 pixels down from y: 250
  { name: PREDEFINED_PESTICIDES[2].name, x: 248, y: 271 }, // Malathion - 20 pixels down from y: 251
  { name: PREDEFINED_PESTICIDES[3].name, x: 333, y: 273 }, // Chlorpyrifos - 20 pixels down from y: 253
  { name: PREDEFINED_PESTICIDES[4].name, x: 417, y: 272 }, // Acetamiprid - 20 pixels down from y: 252, moved left 3px
];

// NEW: Upload mode analysis coordinates - specific coordinates for uploaded images
export const PESTICIDE_COORDINATES_UPLOAD_MODE = [
  { name: PREDEFINED_PESTICIDES[0].name, x: 83, y: 248 }, // Acephate - upload mode coordinates
  { name: PREDEFINED_PESTICIDES[1].name, x: 163, y: 248 }, // Glyphosate - upload mode coordinates
  { name: PREDEFINED_PESTICIDES[2].name, x: 248, y: 248 }, // Malathion - upload mode coordinates
  { name: PREDEFINED_PESTICIDES[3].name, x: 332, y: 248 }, // Chlorpyrifos - upload mode coordinates
  { name: PREDEFINED_PESTICIDES[4].name, x: 420, y: 248 }, // Acetamiprid - upload mode coordinates
];

// NEW: Capture mode test areas - 20 pixels downward from original positions
// These are used for displaying green boxes in capture mode analysis
export const PESTICIDE_ROIS_CAPTURE_MODE: PesticideROI[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name,
    roi: { x: 0.21, y: 0.38, width: 0.08, height: 0.1 }, // Acephate test area - moved down 20px
  },
  {
    name: PREDEFINED_PESTICIDES[1].name,
    roi: { x: 0.34, y: 0.38, width: 0.08, height: 0.1 }, // Glyphosate test area - moved down 20px
  },
  {
    name: PREDEFINED_PESTICIDES[2].name,
    roi: { x: 0.46, y: 0.38, width: 0.08, height: 0.1 }, // Malathion test area - moved down 20px
  },
  {
    name: PREDEFINED_PESTICIDES[3].name,
    roi: { x: 0.59, y: 0.38, width: 0.08, height: 0.1 }, // Chlorpyrifos test area - moved down 20px
  },
  {
    name: PREDEFINED_PESTICIDES[4].name,
    roi: { x: 0.71, y: 0.38, width: 0.08, height: 0.1 }, // Acetamiprid test area - moved down 20px, moved left 3px
  },
];

// NEW: Capture mode center points for guiding dots - centered in the moved green boxes
// These are used for displaying guiding dots in capture mode
export const PESTICIDE_CENTER_POINTS_CAPTURE_MODE: PesticideROI[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name,
    roi: { x: 0.25, y: 0.43, width: 0, height: 0 }, // Acephate center - centered in moved box (0.38 + 0.1/2 = 0.43)
  },
  {
    name: PREDEFINED_PESTICIDES[1].name,
    roi: { x: 0.38, y: 0.43, width: 0, height: 0 }, // Glyphosate center - centered in moved box
  },
  {
    name: PREDEFINED_PESTICIDES[2].name,
    roi: { x: 0.5, y: 0.43, width: 0, height: 0 }, // Malathion center - centered in moved box
  },
  {
    name: PREDEFINED_PESTICIDES[3].name,
    roi: { x: 0.63, y: 0.43, width: 0, height: 0 }, // Chlorpyrifos center - centered in moved box
  },
  {
    name: PREDEFINED_PESTICIDES[4].name,
    roi: { x: 0.75, y: 0.43, width: 0, height: 0 }, // Acetamiprid center - centered in moved box, moved left 3px
  },
];
