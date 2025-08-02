import React, { useRef } from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { SettingsSection } from './SettingsSection';
import { useHistoryStore } from '../../state/historyStore';
import { useCalibrationStore } from '../../state/calibrationStore';

export const DataSettings: React.FC = () => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  
  const { records, setRecords, clearHistory } = useHistoryStore();
  const { userCalibrations, setCalibration } = useCalibrationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export data as JSON
  const handleExport = () => {
    const data = {
      history: records,
      calibrations: userCalibrations,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'biosensor-app-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm('Importing will overwrite your current history and calibration settings. Continue?')) {
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.history && Array.isArray(data.history)) {
          setRecords(data.history);
        }
        if (data.calibrations && typeof data.calibrations === 'object') {
          Object.entries(data.calibrations).forEach(([pesticide, concentrations]) => {
            if (Array.isArray(concentrations)) {
              setCalibration(pesticide, concentrations as number[]);
            }
          });
        }
        alert('Import successful!');
      } catch (err) {
        alert('Import failed: Invalid file format.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be imported again if needed
    e.target.value = '';
  };

  // Confirm before clearing history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all analysis history? This cannot be undone.')) {
      clearHistory();
      window.location.reload();
    }
  };

  return (
    <section>
      <div 
        className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-4"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}
      >
        <div>
          <h3 
            className="text-lg font-semibold mb-1"
            style={{ color: iGEMColors.primary }}
          >
            Export / Import
          </h3>
          <p 
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            Backup or transfer your analysis history and calibration settings.
          </p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            className="px-4 py-2 rounded font-bold transition-colors"
            style={{ 
              backgroundColor: iGEMColors.primary,
              color: 'white'
            }}
            onClick={handleExport}
          >
            Export
          </button>
          <button
            className="px-4 py-2 rounded font-bold transition-colors"
            style={{ 
              backgroundColor: colors.background,
              color: colors.text,
              border: `1px solid ${colors.border}`
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>
      <SettingsSection
        title="Clear History"
        description="Permanently delete all analysis history from this device. This cannot be undone."
        actionLabel="Clear"
        actionDescription="Remove all analysis history from this device."
        onAction={handleClearHistory}
      />
    </section>
  );
}; 