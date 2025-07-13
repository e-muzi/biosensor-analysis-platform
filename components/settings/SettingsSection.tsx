import React from 'react';
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
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-700 rounded-lg">
      <div>
        <p className="font-medium text-gray-200">{title}</p>
        <p className="text-sm text-gray-400">{actionDescription}</p>
      </div>
      <AppButton onClick={onAction} variant={actionVariant} className="mt-2 sm:mt-0">
        {actionLabel}
      </AppButton>
    </div>
  );
}; 