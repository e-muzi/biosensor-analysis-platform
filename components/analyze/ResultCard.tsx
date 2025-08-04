import React from 'react';
import { useThemeStore } from '../../state/themeStore';
import type { CalibrationResult } from '../../types';

interface ResultCardProps {
  result: CalibrationResult;
}

// Default safety thresholds (can be customized per pesticide)
function getSafetyLevel(concentration: number): { level: 'safe' | 'caution' | 'danger'; color: string; bgColor: string; label: string } {
  if (concentration <= 10) {
    return { level: 'safe', color: '#10B981', bgColor: '#D1FAE5', label: 'Safe' };
  } else if (concentration <= 50) {
    return { level: 'caution', color: '#F59E0B', bgColor: '#FEF3C7', label: 'Caution' };
  } else {
    return { level: 'danger', color: '#EF4444', bgColor: '#FEE2E2', label: 'Danger' };
  }
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  const safety = getSafetyLevel(result.estimatedConcentration);

  return (
    <div 
      className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
      style={{ 
        backgroundColor: colors.surface,
        border: `2px solid ${safety.color}`,
        boxShadow: `0 4px 6px ${colors.shadow}`
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        {/* Pesticide Name */}
        <p 
          className="font-bold text-lg break-words max-w-full text-center"
          style={{ color: colors.text }}
        >
          {result.pesticide}
        </p>

        {/* Safety Level Badge */}
        <span 
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
          style={{ 
            backgroundColor: safety.bgColor,
            color: safety.color
          }}
        >
          {safety.label}
        </span>

        {/* Concentration Value */}
        <div className="text-center">
          <p 
            className="text-3xl font-bold"
            style={{ color: safety.color }}
          >
            {result.estimatedConcentration.toFixed(2)}
            <span 
              className="text-lg font-semibold ml-1"
              style={{ color: colors.textSecondary }}
            >
              µM
            </span>
          </p>
        </div>

        {/* Technical Details */}
        <div 
          className="text-xs text-center space-y-1"
          style={{ color: colors.textSecondary }}
        >
          <p>Test: {result.testBrightness.toFixed(2)}</p>
          <p>Cal: {result.calibrationBrightnesses.map(b => b.toFixed(0)).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}; 