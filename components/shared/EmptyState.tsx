import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

//Reusable EmptyState component
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <Paper 
      sx={{ 
        textAlign: 'center', 
        py: 8, 
        px: 4,
        border: 1,
        borderColor: 'divider'
      }}
    >
      <Box 
        sx={{ 
          mx: 'auto', 
          mb: 3,
          color: 'text.secondary',
          '& svg': {
            fontSize: 64
          }
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        component="h3"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
      >
        {description}
      </Typography>
    </Paper>
  );
};
