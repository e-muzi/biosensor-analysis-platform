import { useEffect, useState } from 'react';
import type { Screen, CalibrationResult } from './types';

import { CaptureScreen, AnalysisResultScreen } from './components/analyze';
import { HistoryScreen } from './components/history';
import { SettingsScreen } from './components/settings';
import { Layout } from './components/shared';
import { useThemeStore } from './state/themeStore';

interface AnalysisData {
  results: CalibrationResult[];
  imageSrc: string;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('capture');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentTab, setCurrentTab] = useState<'analyze' | 'history' | 'settings'>('analyze');
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
    setCurrentTab('history');
  }

  const handleTabChange = (tab: 'analyze' | 'history' | 'settings') => {
    setCurrentTab(tab);
    // Reset to capture screen when switching to analyze tab
    if (tab === 'analyze') {
      setActiveScreen('capture');
    }
  };

  const renderScreen = () => {
    // If we're in analysis mode, show the analysis screen regardless of tab
    if (activeScreen === 'analysis' && analysisData) {
      return <AnalysisResultScreen {...analysisData} onDiscard={handleDiscard} onSave={handleSave} />;
    }

    // Otherwise, render based on current tab
    switch (currentTab) {
      case 'analyze':
        return <CaptureScreen onAnalysisComplete={handleAnalysisComplete} />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <CaptureScreen onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={handleTabChange}>
      {renderScreen()}
    </Layout>
  );
}