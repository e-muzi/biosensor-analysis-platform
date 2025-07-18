import React from 'react';
import type { CalibrationResult } from '../../types';

interface ResultCardProps {
  result: CalibrationResult;
}

// Default safety thresholds (can be customized per pesticide)
function getSafetyLevel(concentration: number): { level: 'safe' | 'caution' | 'danger'; color: string; label: string } {
  if (concentration <= 10) {
    return { level: 'safe', color: 'bg-green-700', label: 'Safe' };
  } else if (concentration <= 50) {
    return { level: 'caution', color: 'bg-yellow-600', label: 'Caution' };
  } else {
    return { level: 'danger', color: 'bg-red-700', label: 'Danger' };
  }
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const safety = getSafetyLevel(result.estimatedConcentration);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return '✓';
      case 'medium': return '⚠';
      case 'low': return '?';
      default: return '?';
    }
  };

  return (
    <div className={`p-3 rounded-lg text-center shadow transition-colors duration-200 ${safety.color}`}>
      <div className="flex flex-col items-center justify-center mb-1 space-y-1">
        <p className="font-bold text-cyan-400 text-md break-words max-w-full">{result.pesticide}</p>
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${safety.level === 'safe' ? 'bg-green-900 text-green-200' : safety.level === 'caution' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'}`}>{safety.label}</span>
      </div>
      <p className="text-3xl font-extrabold text-white my-1">
        {result.estimatedConcentration.toFixed(2)}
        <span className="text-lg font-semibold ml-1">µM</span>
      </p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className={`text-xs font-semibold ${getConfidenceColor(result.confidence)}`}>{getConfidenceIcon(result.confidence)}</span>
        <span className={`text-xs ${getConfidenceColor(result.confidence)}`}>{result.confidence} confidence</span>
      </div>
      <p className="text-xs text-gray-200 mt-1">Test: {result.testBrightness.toFixed(2)}</p>
      <p className="text-xs text-gray-300">Cal: {result.calibrationBrightnesses.map(b => b.toFixed(0)).join(', ')}</p>
    </div>
  );
}; 