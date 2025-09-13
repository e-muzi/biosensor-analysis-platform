import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  Paper
} from '@mui/material';
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Analysis Results
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your pesticide analysis has been completed successfully
        </Typography>
      </Box>

      {/* Results Container */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Image Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Analyzed Sample
              </Typography>
              <Box
                component="img"
                src={imageSrc}
                alt="Analyzed sample"
                sx={{
                  width: '100%',
                  maxHeight: 320,
                  objectFit: 'contain',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider'
                }}
              />
            </Grid>

            {/* Results Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Pesticide Detection Results
              </Typography>
              <Grid container spacing={2}>
                {results.map(result => (
                  <Grid size={{ xs: 12, sm: 6 }} key={result.pesticide}>
                    <ResultCard result={result} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ maxWidth: 'md', mx: 'auto' }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppButton 
            onClick={onDiscard} 
            variant="outline" 
            fullWidth
            size="large"
          >
            Discard & Recapture
          </AppButton>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppButton 
            onClick={handleSave} 
            variant="primary"
            fullWidth
            size="large"
          >
            💾 Save Results
          </AppButton>
        </Grid>
      </Grid>
    </Container>
  );
};
