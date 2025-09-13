import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, RestartAlt as RestartAltIcon } from '@mui/icons-material';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { useCalibrationStore } from '../../state/calibrationStore';
import { PREDEFINED_PESTICIDES } from '../../state/pesticideStore';
import { AppButton } from '../shared';

export const CalibrationSettings: React.FC = () => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  
  const { userCalibrations, setCalibration, resetCalibration, resetAll } = useCalibrationStore();
  const [localCal, setLocalCal] = useState(() => {
    // Deep copy to avoid direct mutation
    return Object.fromEntries(
      PREDEFINED_PESTICIDES.map(p => [p.name, [...(userCalibrations[p.name] || p.curve.map(pt => pt.concentration))]])
    );
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameEdits, setNameEdits] = useState(() => {
    // Map of pesticide name to display name
    return Object.fromEntries(PREDEFINED_PESTICIDES.map(p => [p.name, p.name]));
  });
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleInputChange = (pesticide: string, idx: number, value: string) => {
    setLocalCal(prev => ({
      ...prev,
      [pesticide]: prev[pesticide].map((v: number, i: number) => i === idx ? Number(value) : v)
    }));
  };

  const handleSave = (pesticide: string) => {
    setCalibration(pesticide, localCal[pesticide]);
    setEditing(null);
  };

  const handleReset = (pesticide: string) => {
    resetCalibration(pesticide);
    setLocalCal(prev => ({
      ...prev,
      [pesticide]: PREDEFINED_PESTICIDES.find(p => p.name === pesticide)?.curve.map(pt => pt.concentration) || []
    }));
    setEditing(null);
  };

  const handleResetAll = () => {
    resetAll();
    setLocalCal(Object.fromEntries(
      PREDEFINED_PESTICIDES.map(p => [p.name, p.curve.map(pt => pt.concentration)])
    ));
    setEditing(null);
    setShowResetDialog(false);
  };

  // Double-click to edit pesticide name
  const handleNameDoubleClick = (pesticide: string) => {
    setEditingName(pesticide);
  };

  // Save new name on blur or Enter
  const handleNameChange = (pesticide: string, value: string) => {
    setNameEdits(prev => ({ ...prev, [pesticide]: value }));
  };
  const handleNameBlur = (pesticide: string) => {
    setEditingName(null);
  };
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, pesticide: string) => {
    if (e.key === 'Enter') {
      setEditingName(null);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Calibration Strip Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set the calibration concentrations for each pesticide. Double-click the name to edit. You can reset to default at any time.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.keys(localCal).map((pesticide, idx) => (
          <Card key={pesticide}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  {editingName === pesticide ? (
                    <TextField
                      variant="standard"
                      value={nameEdits[pesticide]}
                      autoFocus
                      onChange={e => handleNameChange(pesticide, e.target.value)}
                      onBlur={() => handleNameBlur(pesticide)}
                      onKeyDown={e => handleNameKeyDown(e, pesticide)}
                      sx={{ minWidth: 120 }}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      onDoubleClick={() => handleNameDoubleClick(pesticide)}
                      sx={{ 
                        cursor: 'pointer',
                        color: iGEMColors.primary,
                        fontWeight: 600,
                        userSelect: 'none'
                      }}
                      title="Double-click to edit name"
                    >
                      {nameEdits[pesticide]}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(pesticide)}
                    disabled={editing === pesticide}
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RestartAltIcon />}
                    onClick={() => handleReset(pesticide)}
                    size="small"
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
              
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {localCal[pesticide].map((val: number, idx: number) => (
                  <Grid size={{}} key={idx}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                        #{idx + 1}
                      </Typography>
                      <TextField
                        type="number"
                        size="small"
                        value={val}
                        disabled={editing !== pesticide}
                        onChange={e => handleInputChange(pesticide, idx, e.target.value)}
                        sx={{ width: 80 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              {editing === pesticide && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <AppButton onClick={() => handleSave(pesticide)} variant="primary">
                    Save
                  </AppButton>
                  <AppButton onClick={() => setEditing(null)} variant="secondary">
                    Cancel
                  </AppButton>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <AppButton 
          onClick={() => setShowResetDialog(true)} 
          variant="danger"
        >
          Reset All to Default
        </AppButton>
      </Box>

      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset All Calibrations</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all calibration settings to default? This will overwrite all your custom calibrations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handleResetAll} color="error" variant="contained">
            Reset All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
