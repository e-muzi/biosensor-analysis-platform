import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  IconButton, 
  TextField,
  Grid,
  Chip,
  Collapse,
  Divider,
  Paper
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import type { HistoryRecord } from '../../types';
import { useHistoryStore } from '../../state/historyStore';

interface HistoryItemProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ record, onDelete }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(record.name);
  const updateRecordName = useHistoryStore((state) => state.updateRecordName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameUpdate = () => {
    if (name.trim() !== '') {
      updateRecordName(record.id, name.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameUpdate();
    }
  };

  return (
    <Card 
      sx={{ 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Image */}
          <Box
            component="img"
            src={record.imageSrc}
            alt="History sample"
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              objectFit: 'cover',
              border: 1,
              borderColor: 'divider',
              flexShrink: 0
            }}
          />
          
          {/* Content */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {isEditing ? (
              <TextField
                value={name}
                onChange={handleNameChange}
                onBlur={handleNameUpdate}
                onKeyDown={handleKeyDown}
                variant="standard"
                fullWidth
                autoFocus
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    py: 0.5
                  }
                }}
              />
            ) : (
              <Typography 
                variant="h6" 
                component="p"
                onDoubleClick={() => setIsEditing(true)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                  fontWeight: 600
                }}
              >
                {record.name}
              </Typography>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {record.timestamp}
            </Typography>
            
            <Box sx={{ mt: 1 }}>
              <Chip
                label={isExpanded ? 'Hide Details' : 'Show Details'}
                onClick={() => setIsExpanded(!isExpanded)}
                icon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                size="small"
                sx={{
                  backgroundColor: iGEMColors.primary,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: iGEMColors.primaryDark,
                  }
                }}
              />
            </Box>
          </Box>
          
          {/* Delete Button */}
          <IconButton 
            onClick={() => onDelete(record.id)}
            sx={{
              color: '#EF4444',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.dark',
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        
        {/* Expanded Details */}
        <Collapse in={isExpanded}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Analysis Results
          </Typography>
          <Grid container spacing={2}>
            {record.results.map(res => (
              <Grid size={{ xs: 6, md: 3 }} key={res.pesticide}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: iGEMColors.primary,
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {res.pesticide}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    component="div"
                    sx={{ fontWeight: 'bold', mb: 0.5 }}
                  >
                    {res.concentration.toFixed(2)}
                    <Typography 
                      component="span" 
                      variant="caption" 
                      sx={{ ml: 0.5, color: 'text.secondary' }}
                    >
                      µM
                    </Typography>
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    Bright: {res.brightness.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};
