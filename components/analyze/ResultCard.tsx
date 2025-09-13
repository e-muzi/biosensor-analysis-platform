import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box
} from '@mui/material';
import { useThemeStore } from '../../state/themeStore';
import type { CalibrationResult } from '../../types';

interface ResultCardProps {
  result: CalibrationResult;
}

// Default safety thresholds (can be customized per pesticide)
function getSafetyLevel(concentration: number): { level: 'safe' | 'caution' | 'danger'; color: string; bgColor: string; label: string } {
  if (concentration <= 10) {
    return { level: 'safe', color: '#10B981', bgColor: '#D1FAE5', label: 'Safe' };
  } else if (concentration <= 50) {
    return { level: 'caution', color: '#F59E0B', bgColor: '#FEF3C7', label: 'Caution' };
  } else {
    return { level: 'danger', color: '#EF4444', bgColor: '#FEE2E2', label: 'Danger' };
  }
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  const safety = getSafetyLevel(result.estimatedConcentration);

  return (
    <Card 
      sx={{ 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        border: 2,
        borderColor: safety.color
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Pesticide Name */}
          <Typography 
            variant="h6" 
            component="p"
            sx={{ 
              fontWeight: 'bold',
              wordBreak: 'break-word',
              color: 'text.primary'
            }}
          >
            {result.pesticide}
          </Typography>

          {/* Safety Level Badge */}
          <Chip
            label={safety.label}
            size="small"
            sx={{
              backgroundColor: safety.bgColor,
              color: safety.color,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: '0.75rem'
            }}
          />

          {/* Concentration Value */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="span"
              sx={{ 
                fontWeight: 'bold',
                color: safety.color
              }}
            >
              {result.estimatedConcentration.toFixed(2)}
            </Typography>
            <Typography 
              variant="h6" 
              component="span"
              sx={{ 
                ml: 0.5,
                color: 'text.secondary'
              }}
            >
              µM
            </Typography>
          </Box>

          {/* Technical Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Test: {result.testBrightness.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cal: {result.calibrationBrightnesses.map(b => b.toFixed(0)).join(', ')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
