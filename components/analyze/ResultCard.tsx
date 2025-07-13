import React from 'react';
import type { CalibrationResult } from '../../types';

interface ResultCardProps {
  result: CalibrationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
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
    <div className="bg-gray-700 p-3 rounded-lg text-center shadow">
      <p className="font-bold text-cyan-400 text-md">{result.pesticide}</p>
      <p className="text-3xl font-extrabold text-white my-1">
        {result.estimatedConcentration.toFixed(2)}
        <span className="text-lg font-semibold ml-1">µM</span>
      </p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className={`text-xs font-semibold ${getConfidenceColor(result.confidence)}`}>
          {getConfidenceIcon(result.confidence)}
        </span>
        <span className={`text-xs ${getConfidenceColor(result.confidence)}`}>
          {result.confidence} confidence
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">Test: {result.testBrightness.toFixed(2)}</p>
      <p className="text-xs text-gray-500">Cal: {result.calibrationBrightnesses.map(b => b.toFixed(0)).join(', ')}</p>
    </div>
  );
}; 