import React from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: iGEMColors.primary,
          color: 'white',
          boxShadow: `0 2px 4px ${colors.shadow}`,
          ':hover': {
            backgroundColor: iGEMColors.primaryDark,
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 8px ${colors.shadow}`,
          }
        };
      case 'secondary':
        return {
          backgroundColor: colors.surface,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          ':hover': {
            backgroundColor: colors.border,
          }
        };
      case 'danger':
        return {
          backgroundColor: '#DC2626',
          color: 'white',
          ':hover': {
            backgroundColor: '#B91C1C',
          }
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: iGEMColors.primary,
          border: `2px solid ${iGEMColors.primary}`,
          ':hover': {
            backgroundColor: iGEMColors.primary,
            color: 'white',
          }
        };
      default:
        return {};
    }
  };

  const styles = getVariantStyles();

  return (
    <button 
      className={`${baseClasses} ${className}`}
      style={styles}
      {...props}
    >
      {children}
    </button>
  );
};
