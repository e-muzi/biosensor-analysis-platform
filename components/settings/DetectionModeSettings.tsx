import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import { useModeStore } from '../../state/modeStore';

export const DetectionModeSettings: React.FC = () => {
  const { detectionMode, setDetectionMode } = useModeStore();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDetectionMode(event.target.value as 'preset' | 'strip');
  };

  return (
    <Box>
      <FormControl component='fieldset'>
        <FormLabel component='legend' sx={{ mb: 2 }}>
          Calibration Method
        </FormLabel>
        <RadioGroup
          value={detectionMode}
          onChange={handleModeChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value='preset'
            control={<Radio />}
            label={
              <Box>
                <Typography variant='body1' fontWeight='medium'>
                  Preset Mode
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Uses predefined calibration curves for concentration
                  estimation
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value='strip'
            control={<Radio />}
            label={
              <Box>
                <Typography variant='body1' fontWeight='medium'>
                  Strip Mode
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Uses physical calibration strips for concentration estimation
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {detectionMode === 'preset' && (
        <Alert severity='info' sx={{ mt: 2 }}>
          In preset mode, the app uses predefined calibration curves for
          concentration estimation. These curves are based on RGB values and
          concentrations stored in the code.
        </Alert>
      )}
    </Box>
  );
};
