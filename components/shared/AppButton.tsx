import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import { iGEMColors } from '../../state/themeStore';

interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

// Custom styled button variants
const StyledButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'appVariant',
})<{ appVariant?: string }>(({ theme, appVariant }) => {
  const baseStyles = {
    textTransform: 'none' as const,
    fontWeight: 600,
    borderRadius: 8,
    padding: '8px 16px',
    minWidth: 'auto',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  switch (appVariant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: iGEMColors.primary,
        color: 'white',
        boxShadow: `0 2px 4px ${theme.palette.mode === 'dark' ? iGEMColors.dark.shadow : iGEMColors.light.shadow}`,
        '&:hover': {
          ...baseStyles['&:hover'],
          backgroundColor: iGEMColors.primaryDark,
          boxShadow: `0 4px 8px ${theme.palette.mode === 'dark' ? iGEMColors.dark.shadow : iGEMColors.light.shadow}`,
        },
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          ...baseStyles['&:hover'],
          backgroundColor: theme.palette.action.hover,
        },
      };
    case 'danger':
      return {
        ...baseStyles,
        backgroundColor: '#DC2626',
        color: 'white',
        '&:hover': {
          ...baseStyles['&:hover'],
          backgroundColor: '#B91C1C',
        },
      };
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: iGEMColors.primary,
        border: `2px solid ${iGEMColors.primary}`,
        '&:hover': {
          ...baseStyles['&:hover'],
          backgroundColor: iGEMColors.primary,
          color: 'white',
        },
      };
    default:
      return baseStyles;
  }
});

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  return (
    <StyledButton appVariant={variant} {...props}>
      {children}
    </StyledButton>
  );
};
