import React, { useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Alert,
  Paper,
  Chip
} from '@mui/material';
import { analyzeWithCalibrationStrips } from '../../utils/analysis';
import { AppButton } from '../shared';
import { CameraCapture, ImageUpload, ImageDisplay, ImageAlignment } from './';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import type { CalibrationResult } from '../../types';

interface CaptureScreenProps {
  onAnalysisComplete: (results: CalibrationResult[], imageSrc: string) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onAnalysisComplete }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);

  const handleImageSelect = (src: string) => {
    setImageSrc(src);
    setOriginalImageSrc(src); // For uploaded images, original and processed are the same initially
    setError(null);
    setIsUploadedImage(true);
    setShowAlignment(true); // Show alignment step for uploaded images
  };

  const handleAlignmentConfirm = (alignedImageSrc: string) => {
    setImageSrc(alignedImageSrc);
    setShowAlignment(false);
  };

  const handleAlignmentBack = () => {
    setShowAlignment(false);
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageSrc) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      // Create a temporary image element to analyze
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const calibrationResults = await analyzeWithCalibrationStrips(img);
      onAnalysisComplete(calibrationResults, imageSrc);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try a different one.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageSrc, onAnalysisComplete]);
  
  const handleClearImage = () => {
    setImageSrc(null);
    setOriginalImageSrc(null);
    setError(null);
    setShowAlignment(false);
    setIsUploadedImage(false);
  };

  const handleOpenCamera = () => {
    setError(null);
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCameraError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleCameraCapture = (capturedImageSrc: string, originalImageSrc?: string) => {
    setImageSrc(capturedImageSrc);
    setOriginalImageSrc(originalImageSrc || capturedImageSrc);
    setIsCameraOpen(false);
    setError(null);
    setIsUploadedImage(false);
    // After camera capture, show the auto-cropped result first
    // User can choose to analyze or go to alignment
    setShowAlignment(false);
  };

  // Show alignment screen if image is selected and alignment is enabled
  if (showAlignment && imageSrc) {
    return (
      <ImageAlignment 
        imageSrc={originalImageSrc || imageSrc} // Use original image for alignment if available
        onConfirm={handleAlignmentConfirm}
        onBack={handleAlignmentBack}
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Pesticide Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Capture or upload an image of your test strip for analysis
        </Typography>
      </Box>
      
      {isCameraOpen ? (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={handleCloseCamera}
          onError={handleCameraError}
        />
      ) : (
        <>
          {/* Image Display Section */}
          <Card 
            sx={{ 
              maxWidth: 'md',
              mx: 'auto',
              mb: 4,
              border: 2,
              borderColor: 'divider',
              borderStyle: 'dashed'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <ImageDisplay imageSrc={imageSrc} showROIs={false} />
              {imageSrc && !isUploadedImage && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Chip
                    label="✅ Auto-cropped test kit area ready for analysis"
                    sx={{
                      backgroundColor: `${iGEMColors.primary}20`,
                      color: iGEMColors.primary,
                      fontWeight: 'medium'
                    }}
                  />
                </Box>
              )}
              {imageSrc && isUploadedImage && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Chip
                    label="📷 Uploaded image - use alignment tool for precise cropping"
                    sx={{
                      backgroundColor: `${iGEMColors.accent}20`,
                      color: iGEMColors.accentDark,
                      fontWeight: 'medium'
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          {!imageSrc && (
            <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AppButton 
                    onClick={handleOpenCamera} 
                    variant="primary"
                    fullWidth
                    size="large"
                  >
                    📷 Use Camera
                  </AppButton>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ImageUpload onImageSelect={handleImageSelect} onOpenCamera={handleOpenCamera} />
                </Grid>
              </Grid>
              
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  💡 Tip: Ensure good lighting and a clear view of the test strip
                </Typography>
              </Paper>
            </Box>
          )}
          
          {imageSrc && !showAlignment && (
            <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
              {!isUploadedImage && (
                <Paper 
                  sx={{ 
                    p: 2, 
                    mb: 3,
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                    <strong>Auto-crop completed!</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    You can proceed with analysis or adjust the crop if needed.
                  </Typography>
                </Paper>
              )}
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AppButton 
                    onClick={handleClearImage} 
                    variant="outline" 
                    fullWidth
                  >
                    Clear Image
                  </AppButton>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AppButton 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    variant="primary"
                    fullWidth
                  >
                    {isAnalyzing ? '🔬 Analyzing...' : '🔬 Analyze'}
                  </AppButton>
                </Grid>
              </Grid>
              
              <AppButton 
                onClick={() => setShowAlignment(true)}
                variant="secondary"
                fullWidth
              >
                {isUploadedImage ? '🔧 Adjust & Crop Image' : '�� Adjust Crop'}
              </AppButton>
            </Box>
          )}
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ maxWidth: 'md', mx: 'auto', mt: 2 }}
            >
              ❌ {error}
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};
