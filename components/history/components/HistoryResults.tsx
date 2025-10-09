import { Box, Typography, Grid, Chip, Card, CardContent } from '@mui/material';
import { ImageDisplay } from '../../analyze/ImageDisplay';
import { useModeStore } from '../../../state/modeStore';
import type { AnalysisResult } from '../../../types';
import { getConcentrationLabel, getConcentrationColor } from '../../../utils/analysis/pesticideThresholds';

interface HistoryResultsProps {
  results: AnalysisResult[];
  imageSrc: string;
}

export function HistoryResults({ results, imageSrc }: HistoryResultsProps) {
  const { detectionMode } = useModeStore();
  
  if (!results || results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body2' color='text.secondary'>
          No results available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, p: 2 }}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        Analysis Results
      </Typography>

      {/* Original Image Display */}
      <Box sx={{ mb: 3 }}>
        <Typography variant='subtitle1' sx={{ mb: 1 }}>
          Original Image
        </Typography>
        <ImageDisplay imageSrc={imageSrc} showROIs={false} />
      </Box>

      {/* Analysis Results */}
      <Typography variant='subtitle1' sx={{ mb: 2 }}>
        Detection Results
      </Typography>
      <Grid container spacing={2}>
        {results.map((result, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant='subtitle2'>
                    {result.pesticide}
                  </Typography>
                  <Chip
                    label={getConcentrationLabel(
                      result.concentration,
                      result.pesticide,
                      detectionMode
                    )}
                    color={getConcentrationColor(
                      result.concentration,
                      result.pesticide,
                      detectionMode
                    )}
                    size='small'
                  />
                </Box>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 0.5 }}
                >
                  Concentration: {result.concentration.toFixed(3)} mg/L
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  RGB Value: {(result.rgb || result.brightness || 0).toFixed(0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
