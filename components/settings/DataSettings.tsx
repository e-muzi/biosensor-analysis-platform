import React, { useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { SettingsSection } from './SettingsSection';
import { useHistoryStore } from '../../state/historyStore';
import { useCalibrationStore } from '../../state/calibrationStore';

export const DataSettings: React.FC = () => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  
  const { records, setRecords, clearHistory } = useHistoryStore();
  const { userCalibrations, setCalibration } = useCalibrationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearDialog, setShowClearDialog] = React.useState(false);

  // Export data as JSON
  const handleExport = () => {
    const data = {
      history: records,
      calibrations: userCalibrations,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'biosensor-app-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm('Importing will overwrite your current history and calibration settings. Continue?')) {
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.history && Array.isArray(data.history)) {
          setRecords(data.history);
        }
        if (data.calibrations && typeof data.calibrations === 'object') {
          Object.entries(data.calibrations).forEach(([pesticide, concentrations]) => {
            if (Array.isArray(concentrations)) {
              setCalibration(pesticide, concentrations as number[]);
            }
          });
        }
        alert('Import successful!');
      } catch (err) {
        alert('Import failed: Invalid file format.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be imported again if needed
    e.target.value = '';
  };

  // Confirm before clearing history
  const handleClearHistory = () => {
    clearHistory();
    setShowClearDialog(false);
    window.location.reload();
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h6" sx={{ color: iGEMColors.primary, mb: 1 }}>
                Export / Import
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Backup or transfer your analysis history and calibration settings.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  sx={{ backgroundColor: iGEMColors.primary }}
                >
                  Export
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import
                </Button>
                <input
                  type="file"
                  accept="application/json"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImport}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <SettingsSection
        title="Clear History"
        description="Permanently delete all analysis history from this device. This cannot be undone."
        actionLabel="Clear"
        actionDescription="Remove all analysis history from this device."
        onAction={() => setShowClearDialog(true)}
        icon={<DeleteIcon />}
      />

      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>Clear History</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all analysis history? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>Cancel</Button>
          <Button onClick={handleClearHistory} color="error" variant="contained">
            Clear History
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
