import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box
} from '@mui/material';
import { DataSettings } from './DataSettings';
import { CalibrationSettings } from './CalibrationSettings';
import { AboutSection } from './AboutSection';

export const SettingsScreen: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your pesticide analysis preferences
        </Typography>
      </Box>

      {/* Data Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Data Management
          </Typography>
          <DataSettings />
        </CardContent>
      </Card>

      {/* Calibration Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Calibration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage the calibration concentrations for each pesticide. These values are used for all analyses.
          </Typography>
          <CalibrationSettings />
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardContent>
          <AboutSection />
        </CardContent>
      </Card>
    </Container>
  );
};
