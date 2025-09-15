import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DetectionMode = 'calibration' | 'normalization';

interface ModeState {
  detectionMode: DetectionMode;
  setDetectionMode: (mode: DetectionMode) => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      detectionMode: 'calibration', // Default mode
      setDetectionMode: (mode) => set({ detectionMode: mode }),
    }),
    {
      name: 'detection-mode-storage',
    }
  )
);
