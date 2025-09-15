import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert
} from '@mui/material';
import { useModeStore } from '../../state/modeStore';

export const DetectionModeSettings: React.FC = () => {
  const { detectionMode, setDetectionMode } = useModeStore();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetectionMode(event.target.value as 'calibration' | 'normalization');
  };

  return (
    <Box>
      <FormControl component="fieldset">
        <FormLabel component="legend" sx={{ mb: 2 }}>
          Detection Method
        </FormLabel>
        <RadioGroup
          value={detectionMode}
          onChange={handleModeChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="calibration"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  Calibration Mode
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uses calibration strips for concentration estimation
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="normalization"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  Normalization Mode
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Direct brightness analysis without calibration strips
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {detectionMode === 'normalization' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          In normalization mode, the app will analyze brightness directly without requiring calibration strips. 
          This mode uses predefined regions of interest for each pesticide.
        </Alert>
      )}
    </Box>
  );
};
