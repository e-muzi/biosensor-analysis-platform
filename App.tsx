import { useState, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Layout } from "./components/shared/Layout";
import { CaptureScreen } from "./components/analyze/CaptureScreen";
import { ImageAlignment } from "./components/analyze/ImageAlignment";
import { AnalysisResultScreen } from "./components/analyze/AnalysisResultScreen";
import { HistoryScreen } from "./components/history/HistoryScreen";
import { SettingsScreen } from "./components/settings/SettingsScreen";
import { useThemeStore } from "./state/themeStore";
import { useHistoryStore } from "./state/historyStore";
import { lightTheme, darkTheme } from "./state/muiTheme";
import type { CalibrationResult } from "./types";

function App() {
  const { theme } = useThemeStore();
  const { addRecord } = useHistoryStore();

  const [currentScreen, setCurrentScreen] = useState<"analyze" | "history" | "settings">("analyze");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<CalibrationResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);

  const handleAlignmentConfirm = useCallback((alignedImageSrc: string) => {
    setCapturedImage(alignedImageSrc);
    setShowAlignment(false);
  }, []);

  const handleAlignmentBack = useCallback(() => {
    setShowAlignment(false);
  }, []);

  const handleAnalysisComplete = useCallback((results: CalibrationResult[], imageSrc: string) => {
    setAnalysisResults(results);
    setCapturedImage(imageSrc); // Add this line to fix the analysis bug
    setIsAnalyzing(false);
    
    // Save to history
    const historyItem = {
      id: Date.now().toString(),
      name: `Analysis ${new Date().toLocaleString()}`,
      timestamp: new Date().toISOString(),
      imageSrc,
      results: results.map(r => ({
        pesticide: r.pesticide,
        brightness: r.testBrightness,
        concentration: r.estimatedConcentration,
        confidence: r.confidence
      })),
    };
    addRecord(historyItem);
  }, [addRecord]);

  const handleNewAnalysis = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResults([]);
    setShowAlignment(false);
    setCurrentScreen("analyze");
  }, []);

  const handleBack = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResults([]);
    setShowAlignment(false);
    setCurrentScreen("analyze");
  }, []);

  const renderCurrentScreen = () => {
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
        <AnalysisResultScreen results={analysisResults}
          
          imageSrc={capturedImage}
          onBack={handleBack}
          onNewAnalysis={handleNewAnalysis}
          isAnalyzing={isAnalyzing}
        />
      );
    }

    switch (currentScreen) {
      case "analyze":
        return (
          <CaptureScreen
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case "history":
        return <HistoryScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Layout 
        currentTab={currentScreen} 
        onTabChange={setCurrentScreen}
      >
        {renderCurrentScreen()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
