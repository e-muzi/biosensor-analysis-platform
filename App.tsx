import { useState, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Layout } from './components/shared/Layout';
import { CaptureScreen } from './components/analyze/CaptureScreen';
import { ImageAlignment } from './components/analyze/ImageAlignment';
import { AnalysisResultScreen } from './components/analyze/AnalysisResultScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { useThemeStore } from './state/themeStore';
import { useHistoryStore } from './state/historyStore';
import { lightTheme, darkTheme } from './state/muiTheme';
import type { CalibrationResult } from './types';

function App() {
  const { theme } = useThemeStore();
  const { addRecord } = useHistoryStore();

  const [currentScreen, setCurrentScreen] = useState<
    'analyze' | 'history' | 'settings'
  >('analyze');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<CalibrationResult[]>(
    []
  );
  const [dotPositions, setDotPositions] = useState<Array<{ name: string; x: number; y: number }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);

  const handleAlignmentConfirm = useCallback((alignedImageSrc: string, dotPositions: Array<{ name: string; x: number; y: number }>) => {
    setCapturedImage(alignedImageSrc);
    setShowAlignment(false);
    // Store dot positions for analysis
    setDotPositions(dotPositions);
  }, []);

  const handleAnalysisComplete = useCallback(
    (results: CalibrationResult[], imageSrc: string, analysisDotPositions?: Array<{ name: string; x: number; y: number }>) => {
      setAnalysisResults(results);
      setCapturedImage(imageSrc);
      setPendingImage(null);
      setIsAnalyzing(false);
      
      // Update dot positions if provided (from analysis)
      if (analysisDotPositions && analysisDotPositions.length > 0) {
        setDotPositions(analysisDotPositions);
      }

      const historyItem = {
        id: Date.now().toString(),
        name: `Analysis ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        imageSrc,
        results: results.map(r => ({
          pesticide: r.pesticide,
          rgb: r.testRGB,
          concentration: r.estimatedConcentration,
          confidence: r.confidence,
        })),
      };
      addRecord(historyItem);
    },
    [addRecord]
  );

  const handleImageCapture = useCallback((imageSrc: string) => {
    setPendingImage(imageSrc);
  }, []);

  const handleClearImage = useCallback(() => {
    setPendingImage(null);
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setCapturedImage(null);
    setPendingImage(null);
    setAnalysisResults([]);
    setShowAlignment(false);
    setCurrentScreen('analyze');
  }, []);

  const handleBack = useCallback(() => {
    setCapturedImage(null);
    setPendingImage(null);
    setAnalysisResults([]);
    setShowAlignment(false);
    setCurrentScreen('analyze');
  }, []);

  const handleTabChange = useCallback(
    (tab: 'analyze' | 'history' | 'settings') => {
      setCurrentScreen(tab);
    },
    []
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'analyze':
        if (showAlignment && capturedImage) {
          return (
            <ImageAlignment
              imageSrc={capturedImage}
              onConfirm={handleAlignmentConfirm}
            />
          );
        }

        if (analysisResults.length > 0 && capturedImage) {
          return (
            <AnalysisResultScreen
              results={analysisResults}
              imageSrc={capturedImage}
              dotPositions={dotPositions}
              onBack={handleBack}
              onNewAnalysis={handleNewAnalysis}
              isAnalyzing={isAnalyzing}
            />
          );
        }

        return (
          <CaptureScreen
            onAnalysisComplete={handleAnalysisComplete}
            onImageCapture={handleImageCapture}
            onImageClear={handleClearImage}
            pendingImage={pendingImage}
            dotPositions={dotPositions}
          />
        );

      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Layout currentTab={currentScreen} onTabChange={handleTabChange}>
        {renderCurrentScreen()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
