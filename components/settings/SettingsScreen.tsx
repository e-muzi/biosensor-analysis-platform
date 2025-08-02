import React from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { DataSettings } from './DataSettings';
import { CalibrationSettings } from './CalibrationSettings';
import { AboutSection } from './AboutSection';

export const SettingsScreen: React.FC = () => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  return (
    <div 
      className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col space-y-8"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          Settings
        </h1>
        <p 
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Configure your pesticide analysis preferences
        </p>
      </div>

      {/* Data Section */}
      <section 
        className="rounded-xl p-6 space-y-4"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 4px 6px ${colors.shadow}`
        }}
      >
        <h2 
          className="text-xl font-bold mb-1"
          style={{ color: colors.text }}
        >
          Data Management
        </h2>
        <DataSettings />
      </section>

      {/* Calibration Section */}
      <section 
        className="rounded-xl p-6 space-y-4"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 4px 6px ${colors.shadow}`
        }}
      >
        <h2 
          className="text-xl font-bold mb-1"
          style={{ color: colors.text }}
        >
          Calibration
        </h2>
        <p 
          className="text-sm mb-4"
          style={{ color: colors.textSecondary }}
        >
          Manage the calibration concentrations for each pesticide. These values are used for all analyses.
        </p>
        <CalibrationSettings />
      </section>

      {/* About Section */}
      <section 
        className="rounded-xl p-6"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 4px 6px ${colors.shadow}`
        }}
      >
        <AboutSection />
      </section>
    </div>
  );
};