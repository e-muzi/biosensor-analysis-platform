import React from 'react';
import { useThemeStore } from '../../state/themeStore';
import { AppButton } from '../shared';

interface SettingsSectionProps {
  title: string;
  description: string;
  actionLabel: string;
  actionDescription: string;
  onAction: () => void;
  actionVariant?: 'secondary' | 'danger';
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, 
  // description, 
  actionLabel, 
  actionDescription, 
  onAction, 
  actionVariant = 'secondary' 
}) => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  return (
    <div 
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`
      }}
    >
      <div>
        <p 
          className="font-medium"
          style={{ color: colors.text }}
        >
          {title}
        </p>
        <p 
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          {actionDescription}
        </p>
      </div>
      <AppButton onClick={onAction} variant={actionVariant} className="mt-2 sm:mt-0">
        {actionLabel}
      </AppButton>
    </div>
  );
}; 