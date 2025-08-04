import React from 'react';
import { useThemeStore } from '../../state/themeStore';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  return (
    <div 
      className="text-center py-16 rounded-xl"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 4px 6px ${colors.shadow}`
      }}
    >
      <div 
        className="mx-auto h-16 w-16 mb-4"
        style={{ color: colors.textSecondary }}
      >
        {icon}
      </div>
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: colors.text }}
      >
        {title}
      </h3>
      <p 
        className="text-sm"
        style={{ color: colors.textSecondary }}
      >
        {description}
      </p>
    </div>
  );
}; 