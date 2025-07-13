import React, { useState } from 'react';
import type { HistoryRecord } from '../../types';
import { useHistoryStore } from '../../state/historyStore';

interface HistoryItemProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ record, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(record.name);
  const updateRecordName = useHistoryStore((state) => state.updateRecordName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameUpdate = () => {
    if (name.trim() !== '') {
      updateRecordName(record.id, name.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <img src={record.imageSrc} alt="History sample" className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
        <div className="flex-grow space-y-1">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
              className="bg-gray-700 text-white p-1 rounded"
              autoFocus
            />
          ) : (
            <p onDoubleClick={() => setIsEditing(true)} className="font-semibold text-lg text-gray-200">
              {record.name}
            </p>
          )}
          <p className="text-xs text-gray-500">{record.timestamp}</p>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        <button onClick={() => onDelete(record.id)} className="text-red-500 hover:text-red-400 transition-colors self-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      {isExpanded && (
        <div className="pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {record.results.map(res => (
                     <div key={res.pesticide} className="bg-gray-700 p-3 rounded-lg shadow">
                        <p className="font-bold text-cyan-400 text-sm">{res.pesticide}</p>
                        <p className="text-xl font-bold text-white my-1">
                            {res.concentration.toFixed(2)}
                            <span className="text-sm font-semibold ml-1">µM</span>
                        </p>
                        {res.confidence && (
                          <p className={`text-xs ${res.confidence === 'high' ? 'text-green-400' : res.confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {res.confidence} confidence
                          </p>
                        )}
                        <p className="text-xs text-gray-400">Bright: {res.brightness.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};