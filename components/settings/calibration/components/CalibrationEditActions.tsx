import { Box, Button } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { AppButton } from '../../../shared/AppButton';

interface CalibrationEditActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

export function CalibrationEditActions({
  onSave,
  onCancel,
}: CalibrationEditActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <AppButton
        startIcon={<SaveIcon />}
        onClick={onSave}
        variant='primary'
        color='primary'
        size='small'
      >
        Save
      </AppButton>
      <AppButton
        startIcon={<CancelIcon />}
        onClick={onCancel}
        variant='outline'
        size='small'
      >
        Cancel
      </AppButton>
    </Box>
  );
}
