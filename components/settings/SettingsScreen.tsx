import React from 'react';
import { DataSettings } from './DataSettings';
import { CalibrationSettings } from './CalibrationSettings';
import { AboutSection } from './AboutSection';

export const SettingsScreen: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col space-y-10">
      <h1 className="text-3xl font-extrabold text-cyan-400 mb-2 text-center tracking-tight">Settings</h1>

      {/* Data Section */}
      <section className="bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-700">
        <h2 className="text-xl font-bold text-cyan-300 mb-1">Data</h2>
        <DataSettings />
      </section>

      {/* Calibration Section */}
      <section className="bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-700">
        <h2 className="text-xl font-bold text-cyan-300 mb-1">Calibration</h2>
        <p className="text-gray-400 text-sm mb-2">Manage the calibration concentrations for each pesticide. These values are used for all analyses.</p>
        <CalibrationSettings />
      </section>

      {/* About Section */}
      <section className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800 mt-8">
        <AboutSection />
      </section>
    </div>
  );
};