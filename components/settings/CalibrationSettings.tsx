import { Container, Typography, Box, Card, CardContent, TextField, Button, Grid, Alert } from "@mui/material";
import { useState } from "react";
import { AppButton } from "../shared/AppButton";
import { useCalibrationStore } from "../../state/calibrationStore";
import { PREDEFINED_PESTICIDES } from "../../state/pesticideStore";
import { useModeStore } from "../../state/modeStore";

export function CalibrationSettings() {
  const { userCalibrations, setCalibration, resetCalibration, resetAll } = useCalibrationStore();
  const { detectionMode } = useModeStore();
  const [editingPesticide, setEditingPesticide] = useState<string | null>(null);
  const [tempConcentrations, setTempConcentrations] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleEditStart = (pesticide: string) => {
    setEditingPesticide(pesticide);
    setTempConcentrations(userCalibrations[pesticide]?.join(", ") || "");
    setError(null);
  };

  const handleEditCancel = () => {
    setEditingPesticide(null);
    setTempConcentrations("");
    setError(null);
  };

  const handleEditSave = () => {
    if (!editingPesticide) return;

    try {
      const concentrations = tempConcentrations
        .split(",")
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n) && n >= 0);

      if (concentrations.length < 2) {
        setError("At least 2 concentration values are required");
        return;
      }

      setCalibration(editingPesticide, concentrations);
      setEditingPesticide(null);
      setTempConcentrations("");
      setError(null);
    } catch (err) {
      setError("Invalid concentration values. Please use comma-separated numbers.");
    }
  };

  const handleReset = (pesticide: string) => {
    resetCalibration(pesticide);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Calibration Settings
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        {detectionMode === 'preset' 
          ? "View predefined calibration curves for different pesticides. These curves are used in preset mode."
          : "Configure calibration concentrations for different pesticides. These values are used for strip mode analyses."
        }
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {PREDEFINED_PESTICIDES.map((pesticide) => (
          <Card key={pesticide.name} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">{pesticide.name}</Typography>
                {detectionMode === 'strip' && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {editingPesticide === pesticide.name ? (
                      <>
                        <Button size="small" onClick={handleEditSave} variant="contained">
                          Save
                        </Button>
                        <Button size="small" onClick={handleEditCancel}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="small" onClick={() => handleEditStart(pesticide.name)}>
                          Edit
                        </Button>
                        <Button size="small" onClick={() => handleReset(pesticide.name)} color="warning">
                          Reset
                        </Button>
                      </>
                    )}
                  </Box>
                )}
              </Box>

              {detectionMode === 'preset' ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Preset calibration curve:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {pesticide.curve.map((point, index) => (
                      <Box key={index} sx={{ 
                        px: 2, 
                        py: 1, 
                        bgcolor: "grey.100", 
                        borderRadius: 1,
                        fontSize: "0.875rem"
                      }}>
                        {point.concentration}µM → {point.brightness}
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    This curve is predefined and cannot be edited. Edit the code to modify preset curves.
                  </Typography>
                </Box>
              ) : (
                <>
                  {editingPesticide === pesticide.name ? (
                    <TextField
                      fullWidth
                      label="Concentrations (comma-separated)"
                      value={tempConcentrations}
                      onChange={(e) => setTempConcentrations(e.target.value)}
                      placeholder="0, 25, 50, 75, 100"
                      helperText="Enter concentration values separated by commas"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Current concentrations: {userCalibrations[pesticide.name]?.join(", ") || "Not set"}
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}

        {detectionMode === 'strip' && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <AppButton 
              variant="outline" 
              color="warning"
              onClick={resetAll}
            >
              Reset All Calibrations
            </AppButton>
          </Box>
        )}
      </Box>
    </Container>
  );
}
