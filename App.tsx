import React, { useEffect, useState } from 'react';
import type { Screen, CalibrationResult } from './types';

import { CaptureScreen, AnalysisResultScreen } from './components/analyze';
import { HistoryScreen } from './components/history';
import { SettingsScreen } from './components/settings';
import { Navigation, Layout } from './components/shared';
import { useThemeStore } from './state/themeStore';

interface AnalysisData {
  results: CalibrationResult[];
  imageSrc: string;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('capture');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleAnalysisComplete = (results: CalibrationResult[], imageSrc: string) => {
    setAnalysisData({ results, imageSrc });
    setActiveScreen('analysis');
  };

  const handleDiscard = () => {
    setAnalysisData(null);
    setActiveScreen('capture');
  };
  
  const handleSave = () => {
    setAnalysisData(null);
    setActiveScreen('history');
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'capture':
        return <CaptureScreen onAnalysisComplete={handleAnalysisComplete} />;
      case 'analysis':
        return analysisData ? (
          <AnalysisResultScreen {...analysisData} onDiscard={handleDiscard} onSave={handleSave} />
        ) : (
          <CaptureScreen onAnalysisComplete={handleAnalysisComplete} /> // Fallback
        );
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <CaptureScreen onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <Layout>
      {renderScreen()}
      <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
    </Layout>
  );
}