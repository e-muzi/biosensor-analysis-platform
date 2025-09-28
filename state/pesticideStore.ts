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
  { concentration: 0, rgb: 306 },
  { concentration: 0.3, rgb: 305 },
  { concentration: 1, rgb: 295 },
  { concentration: 3, rgb: 257 },
  { concentration: 10, rgb: 191 },
];

const GLYPHOSATE_CURVE = [
  { concentration: 0, rgb: 145 },
  { concentration: 0.3, rgb: 132 },
  { concentration: 1, rgb: 128 },
  { concentration: 3, rgb: 112 },
  { concentration: 10, rgb: 89 },
];

const MALATHION_CURVE = [
  { concentration: 0, rgb: 233 },
  { concentration: 0.3, rgb: 223 },
  { concentration: 1, rgb: 218 },
  { concentration: 3, rgb: 208 },
  { concentration: 10, rgb: 196 },
];

const CHLORPYRIFOS_CURVE = [
  { concentration: 0, rgb: 172 },
  { concentration: 0.3, rgb: 165 },
  { concentration: 1, rgb: 147 },
  { concentration: 3, rgb: 143 },
  { concentration: 10, rgb: 110 },
];

const ACETAMIPRID_CURVE = [
  { concentration: 0, rgb: 306 },
  { concentration: 0.3, rgb: 305 },
  { concentration: 1, rgb: 295 },
  { concentration: 3, rgb: 257 },
  { concentration: 10, rgb: 191 },
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
    name: 'Malathion',
    curve: MALATHION_CURVE,
  },
  {
    name: 'Chlorpyrifos',
    curve: CHLORPYRIFOS_CURVE,
  },
  {
    name: 'Acetamiprid',
    curve: ACETAMIPRID_CURVE,
  },
];

interface PesticideState {
  pesticides: Pesticide[];
  getCurveForPesticide: (name: string) => CalibrationPoint[];
}

export const usePesticideStore = create<PesticideState>(() => ({
  pesticides: PREDEFINED_PESTICIDES,
  getCurveForPesticide: name => {
    const pesticide = PREDEFINED_PESTICIDES.find(p => p.name === name);
    return pesticide ? pesticide.curve : [];
  },
}));
