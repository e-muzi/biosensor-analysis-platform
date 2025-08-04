import React from 'react';
import { useHistoryStore } from '../../state/historyStore';
import { useThemeStore} from '../../state/themeStore';
import { AppButton } from '../shared';
import { ResultCard } from './';
import type { CalibrationResult } from '../../types';

interface AnalysisResultScreenProps {
  results: CalibrationResult[];
  imageSrc: string;
  onDiscard: () => void;
  onSave: () => void;
}

export const AnalysisResultScreen: React.FC<AnalysisResultScreenProps> = ({ results, imageSrc, onDiscard, onSave }) => {
  const { addRecord } = useHistoryStore();
  const { getColors } = useThemeStore();
  const colors = getColors();

  const handleSave = () => {
    const newRecord = {
      id: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
      imageSrc,
      results: results.map(result => ({
        pesticide: result.pesticide,
        brightness: result.testBrightness,
        concentration: result.estimatedConcentration,
        confidence: result.confidence
      })),
    };
    addRecord({
      ...newRecord,
      name: `Analysis ${new Date().toLocaleDateString()}`
    });
    onSave();
  };

  return (
    <div 
      className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header Section */}
      <div className="text-center mb-6">
        <h2 
          className="text-3xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          Analysis Results
        </h2>
        <p 
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Your pesticide analysis has been completed successfully
        </p>
      </div>

      {/* Results Container */}
      <div 
        className="w-full p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 4px 6px ${colors.shadow}`
        }}
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Analyzed Sample
          </h3>
          <img 
            src={imageSrc} 
            alt="Analyzed sample" 
            className="rounded-lg w-full max-h-80 object-contain border"
            style={{ borderColor: colors.border }}
          />
        </div>

        {/* Results Section */}
        <div className="w-full md:w-1/2">
          <h3 
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Pesticide Detection Results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(result => (
              <ResultCard key={result.pesticide} result={result} />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <AppButton onClick={onDiscard} variant="outline" className="flex-1">
          Discard & Recapture
        </AppButton>
        <AppButton onClick={handleSave} className="flex-1">
          💾 Save Results
        </AppButton>
      </div>
    </div>
  );
};