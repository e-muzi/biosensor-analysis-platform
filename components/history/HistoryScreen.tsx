import React from 'react';
import { useHistoryStore } from '../../state/historyStore';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { HistoryItem } from './';
import { EmptyState } from '../shared';

export const HistoryScreen: React.FC = () => {
  const { records, deleteRecord } = useHistoryStore();
  const { getColors } = useThemeStore();
  const colors = getColors();

  const emptyStateIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div 
      className="p-4 md:p-6 max-w-4xl mx-auto"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 
          className="text-3xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          Analysis History
        </h2>
        <p 
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          View and manage your previous pesticide analysis results
        </p>
      </div>

      {/* Stats Section */}
      {records.length > 0 && (
        <div 
          className="mb-6 p-4 rounded-xl"
          style={{ 
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`
          }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: iGEMColors.primary }}
              >
                {records.length}
              </div>
              <div 
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                Total Analyses
              </div>
            </div>
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: iGEMColors.accent }}
              >
                {records.filter(r => r.results.length > 0).length}
              </div>
              <div 
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                Successful
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Records List */}
      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map(record => (
            <HistoryItem key={record.id} record={record} onDelete={deleteRecord} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={emptyStateIcon}
          title="No saved records"
          description="Perform an analysis to see results here."
        />
      )}
    </div>
  );
};
