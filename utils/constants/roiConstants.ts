import { PREDEFINED_PESTICIDES } from "../../state/pesticideStore";
import type { CalibrationStrip } from "../../types";

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

// Test kit layout constants
export const TEST_KIT_LAYOUT = {
  CALIBRATION_STRIP_WIDTH: 0.06,
  CALIBRATION_STRIP_HEIGHT: 0.7,
  GAP_WIDTH: 0.02,
  TEST_AREA_WIDTH: 0.12,
  TEST_AREA_HEIGHT: 0.7,
  START_Y: 0.15,
} as const;

// Calibration strip configurations - 2 on left, 2 on right
export const CALIBRATION_STRIPS: CalibrationStrip[] = [
  {
    name: PREDEFINED_PESTICIDES[0].name, // Acephate
    roi: { x: 0.04, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 25, 50, 75, 100] // µM concentrations (top to bottom)
  },
  {
    name: PREDEFINED_PESTICIDES[1].name, // Glyphosate
    roi: { x: 0.12, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 50, 100, 150, 200] // µM concentrations (top to bottom)
  },
  {
    name: PREDEFINED_PESTICIDES[2].name, // Mancozeb
    roi: { x: 0.78, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 30, 60, 90, 120] // µM concentrations (top to bottom)
  },
  {
    name: PREDEFINED_PESTICIDES[3].name, // Cypermethrin
    roi: { x: 0.86, y: 0.15, width: 0.06, height: 0.7 },
    concentrations: [0, 45, 90, 135, 180] // µM concentrations (top to bottom)
  }
];

// Pesticide test area ROIs - 4 in the middle
export const PESTICIDE_ROIS: PesticideROI[] = [
  { name: PREDEFINED_PESTICIDES[0].name, roi: { x: 0.20, y: 0.15, width: 0.12, height: 0.7 } }, // Acephate test area
  { name: PREDEFINED_PESTICIDES[1].name, roi: { x: 0.34, y: 0.15, width: 0.12, height: 0.7 } }, // Glyphosate test area
  { name: PREDEFINED_PESTICIDES[2].name, roi: { x: 0.48, y: 0.15, width: 0.12, height: 0.7 } }, // Mancozeb test area
  { name: PREDEFINED_PESTICIDES[3].name, roi: { x: 0.62, y: 0.15, width: 0.12, height: 0.7 } }, // Cypermethrin test area
];
