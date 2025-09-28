import React, { useRef, useEffect } from 'react';
import { Typography, Box, TextField } from '@mui/material';
import { iGEMColors } from '../../../../state/themeStore';

interface PesticideNameProps {
  name: string;
  editingName: string | null;
  nameEdits: Record<string, string>;
  onNameDoubleClick: (pesticide: string) => void;
  onNameChange: (pesticide: string, value: string) => void;
  onNameBlur: (pesticide: string) => void;
  onNameKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    pesticide: string
  ) => void;
}

export function PesticideName({
  name,
  editingName,
  nameEdits,
  onNameDoubleClick,
  onNameChange,
  onNameBlur,
  onNameKeyDown,
}: PesticideNameProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingName === name;
  const displayName = nameEdits[name] || name;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <Box sx={{ mb: 1 }}>
        <TextField
          ref={inputRef}
          value={displayName}
          onChange={e => onNameChange(name, e.target.value)}
          onBlur={() => onNameBlur(name)}
          onKeyDown={e => onNameKeyDown(e, name)}
          variant='outlined'
          size='small'
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: iGEMColors.primary,
              },
              '&:hover fieldset': {
                borderColor: iGEMColors.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: iGEMColors.primary,
              },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant='h6'
        onDoubleClick={() => onNameDoubleClick(name)}
        sx={{
          color: iGEMColors.primary,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {displayName}
      </Typography>
    </Box>
  );
}
