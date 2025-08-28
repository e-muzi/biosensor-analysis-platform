import React, { useState } from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import type { HistoryRecord } from '../../types';
import { useHistoryStore } from '../../state/historyStore';

interface HistoryItemProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ record, onDelete }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  
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
    <div 
      className="p-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 4px 6px ${colors.shadow}`
      }}
    >
      <div className="flex items-center space-x-4">
        {/* Image */}
        <img 
          src={record.imageSrc} 
          alt="History sample" 
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border"
          style={{ borderColor: colors.border }}
        />
        
        {/* Content */}
        <div className="flex-grow space-y-2">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
              className="p-2 rounded-lg font-semibold text-lg"
              style={{ 
                backgroundColor: colors.background,
                color: colors.text,
                border: `1px solid ${colors.border}`
              }}
              autoFocus
            />
          ) : (
            <p 
              onDoubleClick={() => setIsEditing(true)} 
              className="font-semibold text-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: colors.text }}
            >
              {record.name}
            </p>
          )}
          
          <p 
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            {record.timestamp}
          </p>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: iGEMColors.primary }}
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {/* Delete Button */}
        <button 
          onClick={() => onDelete(record.id)} 
          className="p-2 rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/20"
          style={{ color: '#EF4444' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div 
          className="pt-4 mt-4 space-y-4"
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <h4 
            className="font-semibold text-sm"
            style={{ color: colors.textSecondary }}
          >
            Analysis Results
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {record.results.map(res => (
              <div 
                key={res.pesticide} 
                className="p-3 rounded-lg text-center"
                style={{ 
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`
                }}
              >
                <p 
                  className="font-bold text-sm mb-2"
                  style={{ color: iGEMColors.primary }}
                >
                  {res.pesticide}
                </p>
                <p 
                  className="text-xl font-bold mb-1"
                  style={{ color: colors.text }}
                >
                  {res.concentration.toFixed(2)}
                  <span 
                    className="text-sm font-semibold ml-1"
                    style={{ color: colors.textSecondary }}
                  >
                    µM
                  </span>
                </p>
                {/* {res.confidence && (
                  <p 
                    className={`text-xs ${
                      res.confidence === 'high' ? 'text-green-600' : 
                      res.confidence === 'medium' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}
                  >
                    {res.confidence} confidence
                  </p>
                )} */}
                <p 
                  className="text-xs mt-1"
                  style={{ color: colors.textSecondary }}
                >
                  Bright: {res.brightness.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};