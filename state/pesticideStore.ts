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
  { concentration: 0, rgb: { r: 74, g: 198, b: 6 } },
  { concentration: 0.3, rgb: { r: 65, g: 180, b: 8 } }, 
  { concentration: 1, rgb: { r: 58, g: 160, b: 12 } }, 
  { concentration: 3, rgb: { r: 45, g: 140, b: 15 } },  
  { concentration: 10, rgb: { r: 35, g: 120, b: 18 } }, 
  { concentration: 30, rgb: { r: 28, g: 100, b: 20 } }, 
  { concentration: 100, rgb: { r: 22, g: 80, b: 22 } },
  { concentration: 300, rgb: { r: 18, g: 60, b: 25 } }, 
  { concentration: 1000, rgb: { r: 15, g: 40, b: 28 } }, 
];

const GLYPHOSATE_CURVE = [
  { concentration: 0, rgb: { r: 74, g: 198, b: 6 } },
  { concentration: 0.3, rgb: { r: 47, g: 176, b: 4 } },
  { concentration: 1, rgb: { r: 58, g: 151, b: 3 } },
  { concentration: 3, rgb: { r: 70, g: 132, b: 0 } },
  { concentration: 10, rgb: { r: 25, g: 133, b: 5 } },
  { concentration: 30, rgb: { r: 27, g: 113, b: 2 } },
  { concentration: 100, rgb: { r: 44, g: 136, b: 1 } },
  { concentration: 300, rgb: { r: 28, g: 88, b: 2 } },
  { concentration: 1000, rgb: { r: 15, g: 33, b: 6 } },
];

const MANCOZEB_CURVE = [
  { concentration: 0, rgb: { r: 74, g: 198, b: 6 } },
  { concentration: 0.3, rgb: { r: 47, g: 176, b: 4 } },
  { concentration: 1, rgb: { r: 58, g: 151, b: 3 } },
  { concentration: 3, rgb: { r: 70, g: 132, b: 0 } },
  { concentration: 10, rgb: { r: 25, g: 133, b: 5 } },
  { concentration: 30, rgb: { r: 27, g: 113, b: 2 } },
  { concentration: 100, rgb: { r: 44, g: 136, b: 1 } },
  { concentration: 300, rgb: { r: 28, g: 88, b: 2 } },
  { concentration: 1000, rgb: { r: 15, g: 33, b: 6 } },
];

const CYPERMETHRIN_CURVE = [
  { concentration: 0, rgb: { r: 74, g: 198, b: 6 } },
  { concentration: 0.3, rgb: { r: 47, g: 176, b: 4 } },
  { concentration: 1, rgb: { r: 58, g: 151, b: 3 } },
  { concentration: 3, rgb: { r: 70, g: 132, b: 0 } },
  { concentration: 10, rgb: { r: 25, g: 133, b: 5 } },
  { concentration: 30, rgb: { r: 27, g: 113, b: 2 } },
  { concentration: 100, rgb: { r: 44, g: 136, b: 1 } },
  { concentration: 300, rgb: { r: 28, g: 88, b: 2 } },
  { concentration: 1000, rgb: { r: 15, g: 33, b: 6 } },
];

const ATRAZINE_CURVE = [
  { concentration: 0, rgb: { r: 74, g: 198, b: 6 } },
  { concentration: 0.3, rgb: { r: 47, g: 176, b: 4 } },
  { concentration: 1, rgb: { r: 58, g: 151, b: 3 } },
  { concentration: 3, rgb: { r: 70, g: 132, b: 0 } },
  { concentration: 10, rgb: { r: 25, g: 133, b: 5 } },
  { concentration: 30, rgb: { r: 27, g: 113, b: 2 } },
  { concentration: 100, rgb: { r: 44, g: 136, b: 1 } },
  { concentration: 300, rgb: { r: 28, g: 88, b: 2 } },
  { concentration: 1000, rgb: { r: 15, g: 33, b: 6 } },
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