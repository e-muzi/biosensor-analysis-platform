import React from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';

export const AboutSection: React.FC = () => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  return (
    <section>
      <h2 
        className="text-xl font-bold mb-4"
        style={{ color: colors.text }}
      >
        About
      </h2>
      
      <div 
        className="p-6 rounded-xl text-center space-y-4"
        style={{ 
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`
        }}
      >
        {/* Team Information */}
        <div className="space-y-2">
          <div 
            className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center"
            style={{ border: `3px solid ${iGEMColors.primary}` }}
          >
            <div className="w-8 h-8 text-white font-bold text-sm">
              <img 
                src="/hkjs_logo.png" 
                alt="HK-JOINT-SCHOOL" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <h3 
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            HK-JOINT-SCHOOL
          </h3>
          <p 
            className="text-sm font-medium"
            style={{ color: iGEMColors.primary }}
          >
            iGEM 2025 Team
          </p>
        </div>

        {/* App Information */}
        <div className="space-y-2">
          <h4 
            className="text-md font-semibold"
            style={{ color: colors.text }}
          >
            Pesticide Biosensor Analysis App
          </h4>
          <div 
            className="text-xs space-y-1"
            style={{ color: colors.textSecondary }}
          >
            <p>Version: <span className="font-mono">v1.0.0</span></p>
            <p>Build: 2025-01-15</p>
            <p>Platform: Mobile Web App</p>
          </div>
        </div>

        {/* Links */}
        <div className="pt-4 space-y-2">
          <a 
            href="https://github.com/e-muzi/biosensor-apptesting" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: iGEMColors.primary,
              color: 'white'
            }}
          >
            📁 Project GitHub
          </a>
          
          <div 
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            <p>Developed for iGEM 2025 Competition</p>
            <p>Pesticide Detection & Analysis Platform</p>
          </div>
        </div>
      </div>
    </section>
  );
}; 