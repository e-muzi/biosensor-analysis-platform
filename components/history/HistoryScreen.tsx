import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Paper,
  Chip
} from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { useHistoryStore } from '../../state/historyStore';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { HistoryItem } from './';
import { EmptyState } from '../shared';

export const HistoryScreen: React.FC = () => {
  const { records, deleteRecord } = useHistoryStore();
  const { getColors } = useThemeStore();
  const colors = getColors();

  const emptyStateIcon = <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary' }} />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Analysis History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage your previous pesticide analysis results
        </Typography>
      </Box>

      {/* Stats Section */}
      {records.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={4} sx={{ textAlign: 'center' }}>
              <Grid size={{ xs: 6 }}>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    color: iGEMColors.primary,
                    fontWeight: 'bold',
                    mb: 0.5
                  }}
                >
                  {records.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Analyses
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    color: iGEMColors.accent,
                    fontWeight: 'bold',
                    mb: 0.5
                  }}
                >
                  {records.filter(r => r.results.length > 0).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Successful
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      {records.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {records.map(record => (
            <HistoryItem key={record.id} record={record} onDelete={deleteRecord} />
          ))}
        </Box>
      ) : (
        <EmptyState 
          icon={emptyStateIcon}
          title="No saved records"
          description="Perform an analysis to see results here."
        />
      )}
    </Container>
  );
};
