import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { useModeStore } from '../../state/modeStore';
import type { CalibrationResult } from '../../types';
import { getConcentrationLabel, getConcentrationColor } from '../../utils/analysis/pesticideThresholds';

interface ResultCardProps {
  result: CalibrationResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const { detectionMode } = useModeStore();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant='h6'>{result.pesticide}</Typography>
          <Chip
            label={getConcentrationLabel(
              result.estimatedConcentration,
              result.pesticide,
              detectionMode
            )}
            color={getConcentrationColor(
              result.estimatedConcentration,
              result.pesticide,
              detectionMode
            )}
            size='small'
          />
        </Box>

        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          Concentration: {result.estimatedConcentration.toFixed(3)} mg/L
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          RGB Value: {(result.testRGB || result.testBrightness || 0).toFixed(0)}
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          Confidence: {result.confidence}
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mt: 1, fontStyle: 'italic' }}
        >
          {detectionMode === 'preset' ? 'Preset mode' : 'Strip mode'} -
          concentration analysis
        </Typography>
      </CardContent>
    </Card>
  );
}
