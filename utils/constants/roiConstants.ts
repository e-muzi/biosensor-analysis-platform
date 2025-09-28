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
  // Calibration strip values are assumed and not derived from the pesticide samples.
  CALIBRATION_STRIP_WIDTH: 0.06,
  CALIBRATION_STRIP_HEIGHT: 0.7,
  // The following values are corrected based on the glowing samples.
  GAP_WIDTH: 0.09,
  TEST_AREA_WIDTH: 0.08,
  TEST_AREA_HEIGHT: 0.1,
  START_Y: 0.2,
} as const;

// Calibration strip configurations - 2 on left, 3 on right
export const CALIBRATION_STRIPS: CalibrationStrip[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name, // Acephate
    roi: { x: 0.04, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (top to bottom)
  },
  {
    name: PREDEFINED_PESTICIDES[1].name, // Glyphosate
    roi: { x: 0.12, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (top to bottom)
  },
  {
    name: PREDEFINED_PESTICIDES[2].name, // Malathion
    roi: { x: 0.78, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (top to bottom)
  },
  {
    name: PREDEFINED_PESTICIDES[3].name, // Chlorpyrifos
    roi: { x: 0.86, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (top to bottom)
  },
  {
    name: PREDEFINED_PESTICIDES[4].name, // Acetamiprid
    roi: { x: 0.94, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 0.3, 1, 3, 10], // µM concentrations (top to bottom)
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
    roi: { x: 0.72, y: 0.34, width: 0.08, height: 0.1 },
  }, // Acetamiprid test area
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
    roi: { x: 0.76, y: 0.39, width: 0, height: 0 },
  }, // Acetamiprid center
];

// NEW: Specific pixel coordinates for direct sampling
export const PESTICIDE_COORDINATES = [
  { name: PREDEFINED_PESTICIDES[0].name, x: 81, y: 255 }, // Acephate - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[1].name, x: 167, y: 258 }, // Glyphosate - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[2].name, x: 249, y: 258 }, // Malathion - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[3].name, x: 333, y: 258 }, // Chlorpyrifos - Updated to brighter green area
  { name: PREDEFINED_PESTICIDES[4].name, x: 421, y: 258 }, // Acetamiprid - Updated to brighter green area
];
