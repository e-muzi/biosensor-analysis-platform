import { Box, Typography, Grid, Chip, Card, CardContent } from "@mui/material";
import type { AnalysisResult } from "../../../types";

interface HistoryResultsProps {
  results: AnalysisResult[];
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

export function HistoryResults({ results }: HistoryResultsProps) {
  if (!results || results.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No results available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Analysis Results
      </Typography>
      <Grid container spacing={2}>
        {results.map((result, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2">
                    {result.pesticide}
                  </Typography>
                  <Chip
                    label={getConcentrationLabel(result.concentration)}
                    color={getConcentrationColor(result.concentration)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Concentration: {result.concentration.toFixed(3)} ppm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Brightness: {result.brightness.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
