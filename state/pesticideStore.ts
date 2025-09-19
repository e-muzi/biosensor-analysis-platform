import { create } from 'zustand';
import type { CalibrationPoint } from '../types';

export interface Pesticide {
  name: string;
  curve: CalibrationPoint[];
}

// Standard curve data in RGB format
// Original data: Conc (um): 0, 0.3, 1, 3, 10, 30, 100, 300, 1000

// Individual pesticide curves (concentrations in µM)
// These curves represent realistic biosensor responses where higher concentrations
// result in darker colors (lower RGB values)
const ACEPHATE_CURVE = [
  { concentration: 0, rgb: { r: 74, g: 198, b: 6 } },      // Bright green
  { concentration: 0.3, rgb: { r: 65, g: 180, b: 8 } },    // Slightly darker
  { concentration: 1, rgb: { r: 58, g: 160, b: 12 } },     // Darker green
  { concentration: 3, rgb: { r: 45, g: 140, b: 15 } },     // More dark
  { concentration: 10, rgb: { r: 35, g: 120, b: 18 } },    // Darker
  { concentration: 30, rgb: { r: 28, g: 100, b: 20 } },    // Much darker
  { concentration: 100, rgb: { r: 22, g: 80, b: 22 } },    // Very dark
  { concentration: 300, rgb: { r: 18, g: 60, b: 25 } },    // Almost black-green
  { concentration: 1000, rgb: { r: 15, g: 40, b: 28 } },   // Darkest
];

const GLYPHOSATE_CURVE = [
  { concentration: 0, rgb: { r: 80, g: 200, b: 10 } },     // Bright green
  { concentration: 0.3, rgb: { r: 70, g: 185, b: 12 } },   // Slightly darker
  { concentration: 1, rgb: { r: 60, g: 170, b: 15 } },      // Darker green
  { concentration: 3, rgb: { r: 50, g: 150, b: 18 } },      // More dark
  { concentration: 10, rgb: { r: 40, g: 130, b: 20 } },     // Darker
  { concentration: 30, rgb: { r: 32, g: 110, b: 22 } },     // Much darker
  { concentration: 100, rgb: { r: 25, g: 90, b: 25 } },     // Very dark
  { concentration: 300, rgb: { r: 20, g: 70, b: 28 } },     // Almost black-green
  { concentration: 1000, rgb: { r: 16, g: 50, b: 30 } },    // Darkest
];

const MANCOZEB_CURVE = [
  { concentration: 0, rgb: { r: 85, g: 195, b: 8 } },      // Bright green
  { concentration: 0.3, rgb: { r: 75, g: 180, b: 10 } },    // Slightly darker
  { concentration: 1, rgb: { r: 65, g: 165, b: 12 } },      // Darker green
  { concentration: 3, rgb: { r: 55, g: 145, b: 15 } },      // More dark
  { concentration: 10, rgb: { r: 45, g: 125, b: 18 } },      // Darker
  { concentration: 30, rgb: { r: 35, g: 105, b: 20 } },     // Much darker
  { concentration: 100, rgb: { r: 28, g: 85, b: 22 } },      // Very dark
  { concentration: 300, rgb: { r: 22, g: 65, b: 25 } },      // Almost black-green
  { concentration: 1000, rgb: { r: 18, g: 45, b: 28 } },     // Darkest
];

const CYPERMETHRIN_CURVE = [
  { concentration: 0, rgb: { r: 90, g: 190, b: 12 } },     // Bright green
  { concentration: 0.3, rgb: { r: 80, g: 175, b: 14 } },    // Slightly darker
  { concentration: 1, rgb: { r: 70, g: 160, b: 16 } },      // Darker green
  { concentration: 3, rgb: { r: 60, g: 140, b: 18 } },      // More dark
  { concentration: 10, rgb: { r: 50, g: 120, b: 20 } },     // Darker
  { concentration: 30, rgb: { r: 40, g: 100, b: 22 } },     // Much darker
  { concentration: 100, rgb: { r: 32, g: 80, b: 24 } },     // Very dark
  { concentration: 300, rgb: { r: 25, g: 60, b: 26 } },      // Almost black-green
  { concentration: 1000, rgb: { r: 20, g: 40, b: 28 } },    // Darkest
];

const ATRAZINE_CURVE = [
  { concentration: 0, rgb: { r: 95, g: 185, b: 15 } },     // Bright green
  { concentration: 0.3, rgb: { r: 85, g: 170, b: 17 } },    // Slightly darker
  { concentration: 1, rgb: { r: 75, g: 155, b: 19 } },      // Darker green
  { concentration: 3, rgb: { r: 65, g: 135, b: 21 } },      // More dark
  { concentration: 10, rgb: { r: 55, g: 115, b: 23 } },     // Darker
  { concentration: 30, rgb: { r: 45, g: 95, b: 25 } },      // Much darker
  { concentration: 100, rgb: { r: 35, g: 75, b: 27 } },     // Very dark
  { concentration: 300, rgb: { r: 28, g: 55, b: 29 } },      // Almost black-green
  { concentration: 1000, rgb: { r: 22, g: 35, b: 31 } },   // Darkest
];

// List of predefined pesticides that are used in the app
export const PREDEFINED_PESTICIDES: Pesticide[] = [
  {
    name: 'Acephate',
    curve: ACEPHATE_CURVE,
  },
  {
    name: 'Glyphosate',
    curve: GLYPHOSATE_CURVE,
  },
  {
    name: 'Mancozeb',
    curve: MANCOZEB_CURVE,
  },
  {
    name: 'Cypermethrin',
    curve: CYPERMETHRIN_CURVE,
  },
  {
    name: 'Atrazine',
    curve: ATRAZINE_CURVE,
  },
];


interface PesticideState {
  pesticides: Pesticide[];
  getCurveForPesticide: (name: string) => CalibrationPoint[];
}

export const usePesticideStore = create<PesticideState>(() => ({
  pesticides: PREDEFINED_PESTICIDES,
  getCurveForPesticide: (name) => {
    const pesticide = PREDEFINED_PESTICIDES.find(p => p.name === name);
    return pesticide ? pesticide.curve : [];
  }
}));