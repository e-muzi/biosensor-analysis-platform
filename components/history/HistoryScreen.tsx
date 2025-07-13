import React from 'react';
import { useHistoryStore } from '../../state/historyStore';
import { HistoryItem } from './';
import { EmptyState } from '../shared';

export const HistoryScreen: React.FC = () => {
  const { records, removeRecord } = useHistoryStore();

  const emptyStateIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Measurement History</h2>
      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map(record => (
            <HistoryItem key={record.id} record={record} onDelete={removeRecord} />
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
