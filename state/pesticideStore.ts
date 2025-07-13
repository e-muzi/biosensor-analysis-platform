import { create } from 'zustand';
import type { CalibrationPoint } from '../types';

export interface Pesticide {
  name: string;
  curve: CalibrationPoint[];
}

export const PREDEFINED_PESTICIDES: Pesticide[] = [
  {
    name: 'Acephate',
    curve: [
      { concentration: 0, brightness: 5 },
      { concentration: 10, brightness: 30 },
      { concentration: 50, brightness: 130 },
      { concentration: 100, brightness: 220 },
      { concentration: 150, brightness: 250 },
    ],
  },
  {
    name: 'Glyphosate',
    curve: [
      { concentration: 0, brightness: 8 },
      { concentration: 20, brightness: 45 },
      { concentration: 80, brightness: 150 },
      { concentration: 150, brightness: 230 },
      { concentration: 200, brightness: 255 },
    ],
  },
  {
    name: 'Mancozeb',
    curve: [
      { concentration: 0, brightness: 6 },
      { concentration: 5, brightness: 25 },
      { concentration: 25, brightness: 110 },
      { concentration: 75, brightness: 200 },
      { concentration: 125, brightness: 245 },
    ],
  },
  {
    name: 'Cypermethrin',
    curve: [
      { concentration: 0, brightness: 10 },
      { concentration: 15, brightness: 50 },
      { concentration: 60, brightness: 160 },
      { concentration: 120, brightness: 235 },
      { concentration: 180, brightness: 255 },
    ],
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