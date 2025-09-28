import React from 'react';
import { Grid, Box, Typography, TextField } from '@mui/material';

interface CalibrationInputsProps {
  pesticide: string;
  values: number[];
  editing: string | null;
  onInputChange: (pesticide: string, idx: number, value: string) => void;
}

export const CalibrationInputs: React.FC<CalibrationInputsProps> = ({
  pesticide,
  values,
  editing,
  onInputChange,
}) => {
  return (
    <Grid container spacing={1} sx={{ mb: 2 }}>
      {values.map((val: number, idx: number) => (
        <Grid size={{}} key={idx}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ mb: 0.5 }}
            >
              #{idx + 1}
            </Typography>
            <TextField
              type='number'
              size='small'
              value={val}
              disabled={editing !== pesticide}
              onChange={e => onInputChange(pesticide, idx, e.target.value)}
              sx={{ width: 80 }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
