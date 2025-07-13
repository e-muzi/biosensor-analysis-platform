import React, { useState } from 'react';
import { useHistoryStore } from '../../state/historyStore';
import { SettingsSection } from './';

export const SettingsScreen: React.FC = () => {
  const { clearHistory } = useHistoryStore();
  const [feedback, setFeedback] = useState('');

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all measurement history? This cannot be undone.')) {
      clearHistory();
      setFeedback('Measurement history cleared.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Settings</h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Data Management</h3>
          <p className="text-sm text-gray-400 mt-1">Permanently delete stored application data.</p>
        </div>
        
        <SettingsSection
          title="Clear Measurement History"
          description="Deletes all saved analysis records."
          actionLabel="Clear History"
          actionDescription="Deletes all saved analysis records."
          onAction={handleClearHistory}
          actionVariant="danger"
        />

        {feedback && (
          <div className="text-center p-2 bg-green-800 text-green-200 rounded-md">
            {feedback}
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-500">
        <p className="font-bold">HK-Joint-School v1.1.0</p>
        <p>Biosensor Analysis Platform</p>
      </div>
    </div>
  );
};