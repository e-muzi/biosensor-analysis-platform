import React from 'react';
import { ThemeSettings } from './ThemeSettings';
import { DataSettings } from './DataSettings';
import { CalibrationSettings } from './CalibrationSettings';
import { AboutSection } from './AboutSection';

export const SettingsScreen: React.FC = () => {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col space-y-10">
      <ThemeSettings />
      <DataSettings />
      <section>
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Calibration</h2>
        <p className="text-gray-400 text-sm mb-2">Manage the calibration concentrations for each pesticide. These values are used for all analyses.</p>
        <CalibrationSettings />
      </section>
      <AboutSection />
    </div>
  );
};