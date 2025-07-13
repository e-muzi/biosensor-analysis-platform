import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div className="text-center py-16 bg-gray-800 rounded-lg">
      <div className="mx-auto h-12 w-12 text-gray-500">
        {icon}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-300">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}; 