import { useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { ImageDisplay } from './ImageDisplay';
import { ResultCard } from './ResultCard';
import type { CalibrationResult } from '../../types';

interface AnalysisResultScreenProps {
  results: CalibrationResult[];
  imageSrc: string;
  onBack: () => void;
  onNewAnalysis: () => void;
  isAnalyzing: boolean;
}

export function AnalysisResultScreen({
  results,
  imageSrc,
  onBack,
  onNewAnalysis,
  isAnalyzing,
}: AnalysisResultScreenProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  if (isAnalyzing) {
    return (
      <Container maxWidth='md' sx={{ py: 3, pb: 12 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant='h6'>Analyzing image...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 3, pb: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant='outlined'
        >
          Back
        </Button>
        <Typography variant='h4' sx={{ flexGrow: 1 }}>
          Analysis Results
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={onNewAnalysis}
          variant='contained'
          color='primary'
        >
          New Analysis
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ImageDisplay 
            ref={imageRef} 
            imageSrc={imageSrc} 
            showCaptureModePositions={results.some(result => result.isCaptureMode)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='h6'>Detection Results</Typography>
            {results.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
