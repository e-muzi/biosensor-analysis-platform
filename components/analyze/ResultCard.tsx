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

const getBrightnessLabel = (brightness: number): string => {
  if (brightness < 50) return "Very Dark";
  if (brightness < 100) return "Dark";
  if (brightness < 150) return "Medium";
  if (brightness < 200) return "Bright";
  return "Very Bright";
};

const getBrightnessColor = (brightness: number): "success" | "warning" | "error" => {
  if (brightness < 100) return "success";
  if (brightness < 180) return "warning";
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
            label={detectionMode === 'calibration' 
              ? getConcentrationLabel(result.estimatedConcentration)
              : getBrightnessLabel(result.testBrightness)
            }
            color={detectionMode === 'calibration'
              ? getConcentrationColor(result.estimatedConcentration)
              : getBrightnessColor(result.testBrightness)
            }
            size="small"
          />
        </Box>
        
        {detectionMode === 'calibration' && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Concentration: {result.estimatedConcentration.toFixed(3)} ppm
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Brightness: {result.testBrightness.toFixed(2)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Confidence: {result.confidence}
        </Typography>

        {detectionMode === 'normalization' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            Normalization mode - brightness analysis only
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
