import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PREDEFINED_PESTICIDES } from './pesticideStore';

export interface CalibrationSettings {
  [pesticide: string]: number[]; // e.g. { Acephate: [0, 25, 50, 75, 100], ... }
}

interface CalibrationStoreState {
  userCalibrations: CalibrationSettings;
  setCalibration: (pesticide: string, concentrations: number[]) => void;
  resetCalibration: (pesticide: string) => void;
  resetAll: () => void;
}

const defaultCalibrations: CalibrationSettings = Object.fromEntries(
  PREDEFINED_PESTICIDES.map(p => [p.name, p.curve.map(pt => pt.concentration)])
);

export const useCalibrationStore = create<CalibrationStoreState>()(
  persist(
    (set, get) => ({
      userCalibrations: { ...defaultCalibrations },
      setCalibration: (pesticide, concentrations) =>
        set(state => ({
          userCalibrations: {
            ...state.userCalibrations,
            [pesticide]: concentrations,
          },
        })),
      resetCalibration: (pesticide) =>
        set(state => ({
          userCalibrations: {
            ...state.userCalibrations,
            [pesticide]: defaultCalibrations[pesticide],
          },
        })),
      resetAll: () =>
        set(() => ({
          userCalibrations: { ...defaultCalibrations },
        })),
    }),
    {
      name: 'user-calibration-settings',
    }
  )
);

export function getCalibrationForPesticide(pesticide: string): number[] {
  const store = useCalibrationStore.getState();
  return store.userCalibrations[pesticide] || defaultCalibrations[pesticide] || [];
} 