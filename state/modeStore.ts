import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DetectionMode = 'preset' | 'strip';

interface ModeState {
  detectionMode: DetectionMode;
  setDetectionMode: (mode: DetectionMode) => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      detectionMode: 'preset', // Default mode
      setDetectionMode: (mode) => set({ detectionMode: mode }),
    }),
    {
      name: 'detection-mode-storage',
    }
  )
);
