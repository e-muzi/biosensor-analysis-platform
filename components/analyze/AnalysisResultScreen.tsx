import React from 'react';
import { useHistoryStore } from '../../state/historyStore';
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
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Calibration Analysis Results</h2>
      <div className="w-full bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6">
        <img src={imageSrc} alt="Analyzed sample" className="rounded-lg w-full md:w-1/2 max-h-80 object-contain" />
        <div className="w-full md:w-1/2 h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(result => (
              <ResultCard key={result.pesticide} result={result} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <AppButton onClick={onDiscard} variant="secondary">Discard & Recapture</AppButton>
        <AppButton onClick={handleSave}>Save Results</AppButton>
      </div>
    </div>
  );
};