import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { useModeStore } from "../../state/modeStore";
import type { CalibrationResult } from "../../types";

interface ResultCardProps {
  result: CalibrationResult;
}

const getConcentrationLabel = (concentration: number): string => {
  if (concentration < 0.1) return "Low";
  if (concentration < 1.0) return "Medium";
  return "High";
};

const getConcentrationColor = (concentration: number): "success" | "warning" | "error" => {
  if (concentration < 0.1) return "success";
  if (concentration < 1.0) return "warning";
  return "error";
};


export function ResultCard({ result }: ResultCardProps) {
  const { detectionMode } = useModeStore();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">
            {result.pesticide}
          </Typography>
          <Chip
            label={detectionMode === 'strip' 
              ? getConcentrationLabel(result.estimatedConcentration)
              : getConcentrationLabel(result.estimatedConcentration)
            }
            color={detectionMode === 'strip'
              ? getConcentrationColor(result.estimatedConcentration)
              : getConcentrationColor(result.estimatedConcentration)
            }
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Concentration: {result.estimatedConcentration.toFixed(3)} µM
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          RGB Value: {(result.testRGB || result.testBrightness || 0).toFixed(0)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Confidence: {result.confidence}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
          {detectionMode === 'preset' ? 'Preset mode' : 'Strip mode'} - concentration analysis
        </Typography>
      </CardContent>
    </Card>
  );
}
