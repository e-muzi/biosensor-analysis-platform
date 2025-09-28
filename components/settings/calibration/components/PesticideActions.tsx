import React from 'react';
import { Box, Button } from '@mui/material';
import {
  Edit as EditIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';

interface PesticideActionsProps {
  pesticide: string;
  editing: string | null;
  onEdit: (pesticide: string) => void;
  onReset: (pesticide: string) => void;
}

export const PesticideActions: React.FC<PesticideActionsProps> = ({
  pesticide,
  editing,
  onEdit,
  onReset,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant='outlined'
        startIcon={<EditIcon />}
        onClick={() => onEdit(pesticide)}
        disabled={editing === pesticide}
        size='small'
      >
        Edit
      </Button>
      <Button
        variant='outlined'
        color='error'
        startIcon={<RestartAltIcon />}
        onClick={() => onReset(pesticide)}
        size='small'
      >
        Reset
      </Button>
    </Box>
  );
};
