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

// Calibration strip configurations - Updated for strip mode test case
// Moved upwards and updated for new test case with 0.01, 0.005, 0.001 concentrations
// Previous strip method commented out for test case - using new coordinates and concentrations
export const CALIBRATION_STRIPS: CalibrationStrip[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name, // Acephate
    roi: { x: 0.192, y: 0.481, width: 0.08, height: 0.04 }, // Moved up from 0.55 to 0.481
    concentrations: [0.01, 0.005, 0.001], // Updated concentrations for test case
  },
  {
    name: PREDEFINED_PESTICIDES[1].name, // Glyphosate
    roi: { x: 0.349, y: 0.481, width: 0.08, height: 0.04 }, // Moved up from 0.55 to 0.481
    concentrations: [0.01, 0.005, 0.001], // Updated concentrations for test case
  },
  {
    name: PREDEFINED_PESTICIDES[2].name, // Malathion
    roi: { x: 0.498, y: 0.481, width: 0.08, height: 0.04 }, // Moved up from 0.55 to 0.481
    concentrations: [0.01, 0.005, 0.001], // Updated concentrations for test case
  },
  {
    name: PREDEFINED_PESTICIDES[3].name, // Chlorpyrifos
    roi: { x: 0.651, y: 0.481, width: 0.08, height: 0.04 }, // Moved up from 0.55 to 0.481
    concentrations: [0.01, 0.005, 0.001], // Updated concentrations for test case
  },
  {
    name: PREDEFINED_PESTICIDES[4].name, // Acetamiprid
    roi: { x: 0.799, y: 0.481, width: 0.08, height: 0.04 }, // Moved up from 0.55 to 0.481
    concentrations: [0.01, 0.005, 0.001], // Updated concentrations for test case
  },
];

// Pesticide test area ROIs - Updated for strip mode coordinates
// These are now reference rectangles for user visualization (green boxes)
// Based on new coordinates: 269,408; 488,410; 697,406; 911,410; 1119,405
export const PESTICIDE_ROIS: PesticideROI[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name,
    roi: { x: 0.192, y: 0.378, width: 0.08, height: 0.06 }, // Acephate test area
  },
  {
    name: PREDEFINED_PESTICIDES[1].name,
    roi: { x: 0.349, y: 0.380, width: 0.08, height: 0.06 }, // Glyphosate test area
  },
  {
    name: PREDEFINED_PESTICIDES[2].name,
    roi: { x: 0.498, y: 0.376, width: 0.08, height: 0.06 }, // Malathion test area
  },
  {
    name: PREDEFINED_PESTICIDES[3].name,
    roi: { x: 0.651, y: 0.380, width: 0.08, height: 0.06 }, // Chlorpyrifos test area
  },
  {
    name: PREDEFINED_PESTICIDES[4].name,
    roi: { x: 0.799, y: 0.375, width: 0.08, height: 0.06 }, // Acetamiprid test area
  },
];

// Center points for 5-pixel sampling (center of each green box) - Updated for strip mode
export const PESTICIDE_CENTER_POINTS: PesticideROI[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name,
    roi: { x: 0.232, y: 0.408, width: 0, height: 0 },
  }, // Acephate center
  {
    name: PREDEFINED_PESTICIDES[1].name,
    roi: { x: 0.389, y: 0.410, width: 0, height: 0 },
  }, // Glyphosate center
  {
    name: PREDEFINED_PESTICIDES[2].name,
    roi: { x: 0.538, y: 0.406, width: 0, height: 0 },
  }, // Malathion center
  {
    name: PREDEFINED_PESTICIDES[3].name,
    roi: { x: 0.691, y: 0.410, width: 0, height: 0 },
  }, // Chlorpyrifos center
  {
    name: PREDEFINED_PESTICIDES[4].name,
    roi: { x: 0.839, y: 0.405, width: 0, height: 0 },
  }, // Acetamiprid center
];

// NEW: Specific calibration points for test case
// Calibration points: 695,519; 907,517; 1121,519 for 0.01; 0.005; 0.001 concentrations
export const CALIBRATION_POINTS = [
  { x: 695, y: 519, concentration: 0.01 }, // First calibration point
  { x: 907, y: 517, concentration: 0.005 }, // Second calibration point  
  { x: 1121, y: 519, concentration: 0.001 }, // Third calibration point
];

// NEW: Specific pixel coordinates for direct sampling - Updated for strip mode
export const PESTICIDE_COORDINATES = [
  { name: PREDEFINED_PESTICIDES[0].name, x: 269, y: 408 }, // Acephate - 1st position
  { name: PREDEFINED_PESTICIDES[1].name, x: 488, y: 410 }, // Glyphosate - 2nd position
  { name: PREDEFINED_PESTICIDES[2].name, x: 697, y: 406 }, // Malathion - 3rd position
  { name: PREDEFINED_PESTICIDES[3].name, x: 911, y: 410 }, // Chlorpyrifos - 4th position
  { name: PREDEFINED_PESTICIDES[4].name, x: 1119, y: 405 }, // Acetamiprid - 5th position
];
