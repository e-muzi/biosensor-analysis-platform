import React from 'react';
import { Typography, Box } from '@mui/material';

interface AlignmentHeaderProps {
  title: string;
  subtitle: string;
  textColor: string;
  subtitleColor: string;
}

// Alignment Header
export const AlignmentHeader: React.FC<AlignmentHeaderProps> = ({
  title,
  subtitle,
  textColor,
  subtitleColor,
}) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography
        variant='h3'
        component='h2'
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: textColor,
        }}
      >
        {title}
      </Typography>
      <Typography variant='body2' sx={{ color: subtitleColor }}>
        {subtitle}
      </Typography>
    </Box>
  );
};
