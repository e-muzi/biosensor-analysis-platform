import React from 'react';
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { AppButton } from '../shared';

interface SettingsSectionProps {
  title: string;
  description: string;
  actionLabel: string;
  actionDescription: string;
  onAction: () => void;
  actionVariant?: 'secondary' | 'danger';
  icon?: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, 
  description, 
  actionLabel, 
  actionDescription, 
  onAction, 
  actionVariant = 'secondary',
  icon
}) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {icon}
              <Typography variant="subtitle1" component="p" sx={{ fontWeight: 500 }}>
                {title}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {actionDescription}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <AppButton 
                onClick={onAction} 
                variant={actionVariant}
                fullWidth
              >
                {actionLabel}
              </AppButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
