import { useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  
} from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";

interface HistoryNameProps {
  name: string;
  isEditing: boolean;
  onDoubleClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onNameUpdate: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HistoryName({
  name,
  isEditing,
  onDoubleClick,
  onKeyDown,
  onNameUpdate,
  onNameChange,
}: HistoryNameProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (isEditing) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          ref={inputRef}
          value={name}
          onChange={onNameChange}
          onKeyDown={onKeyDown}
          variant="outlined"
          size="small"
          fullWidth
          autoFocus
        />
        <IconButton onClick={onNameUpdate} size="small">
          <CheckIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography 
        variant="h6" 
        onDoubleClick={onDoubleClick}
        sx={{ cursor: "pointer", flexGrow: 1 }}
      >
        {name}
      </Typography>
    </Box>
  );
}
