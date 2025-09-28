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

  const [currentScreen, setCurrentScreen] = useState<
    "analyze" | "history" | "settings"
  >("analyze");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null); // Image captured but not yet analyzed
  const [analysisResults, setAnalysisResults] = useState<CalibrationResult[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);

  const handleAlignmentConfirm = useCallback((alignedImageSrc: string) => {
    setCapturedImage(alignedImageSrc);
    setShowAlignment(false);
  }, []);

  const handleAlignmentBack = useCallback(() => {
    setShowAlignment(false);
  }, []);

  const handleAnalysisComplete = useCallback(
    (results: CalibrationResult[], imageSrc: string) => {
      setAnalysisResults(results);
      setCapturedImage(imageSrc);
      setPendingImage(null); // Clear pending image since analysis is complete
      setIsAnalyzing(false);

      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        name: `Analysis ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        imageSrc,
        results: results.map((r) => ({
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
    // Don't clear analysis results when capturing a new image
  }, []);

  const handleClearImage = useCallback(() => {
    setPendingImage(null);
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setCapturedImage(null);
    setPendingImage(null);
    setAnalysisResults([]);
    setShowAlignment(false);
    setCurrentScreen("analyze");
  }, []);

  const handleBack = useCallback(() => {
    setCapturedImage(null);
    setPendingImage(null);
    setAnalysisResults([]);
    setShowAlignment(false);
    setCurrentScreen("analyze");
  }, []);

  const handleTabChange = useCallback(
    (tab: "analyze" | "history" | "settings") => {
      setCurrentScreen(tab);
    },
    []
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "analyze":
        // Show alignment if in alignment mode
        if (showAlignment && capturedImage) {
          return (
            <ImageAlignment
              imageSrc={capturedImage}
              onConfirm={handleAlignmentConfirm}
            />
          );
        }

        // Show analysis results if available
        if (analysisResults.length > 0 && capturedImage) {
          return (
            <AnalysisResultScreen
              results={analysisResults}
              imageSrc={capturedImage}
              onBack={handleBack}
              onNewAnalysis={handleNewAnalysis}
              isAnalyzing={isAnalyzing}
            />
          );
        }

        // Show capture screen by default
        return (
          <CaptureScreen
            onAnalysisComplete={handleAnalysisComplete}
            onImageCapture={handleImageCapture}
            onImageClear={handleClearImage}
            pendingImage={pendingImage}
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
      <Layout currentTab={currentScreen} onTabChange={handleTabChange}>
        {renderCurrentScreen()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
