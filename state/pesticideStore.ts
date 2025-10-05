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
  { concentration: 0, rgb: 359 },
  { concentration: 0.3, rgb: 337 },
  { concentration: 1, rgb: 311 },
];

const GLYPHOSATE_CURVE = [
  { concentration: 0, rgb: 381 },
  { concentration: 0.3, rgb: 367 },
  { concentration: 1, rgb: 348 },
];

const MALATHION_CURVE = [
  { concentration: 0, rgb: 273 },
  { concentration: 0.3, rgb: 209 },
  { concentration: 1, rgb: 183 },
];

const CHLORPYRIFOS_CURVE = [
  { concentration: 0, rgb: 179 },
  { concentration: 0.3, rgb: 164 },
  { concentration: 1, rgb: 147 },
];

const ACETAMIPRID_CURVE = [
  { concentration: 0, rgb: 358 },
  { concentration: 0.3, rgb: 343 },
  { concentration: 1, rgb: 333 },
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
