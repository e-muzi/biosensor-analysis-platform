import { useState, useCallback } from 'react';
import { Card, Collapse } from '@mui/material';
import { HistoryHeader } from './components/HistoryHeader';
import { HistoryName } from './components/HistoryName';
import { HistoryResults } from './components/HistoryResults';
import { useHistoryItemLogic } from './hooks/useHistoryItemLogic';
import type { HistoryRecord } from '../../types';

interface HistoryItemProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
}

export function HistoryItem({
  record,
  onDelete,
  onUpdateName,
}: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    name,
    isEditing,
    handleNameChange,
    handleNameUpdate,
    handleKeyDown,
    handleDoubleClick,
  } = useHistoryItemLogic(record.name, newName =>
    onUpdateName(record.id, newName)
  );

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <Card sx={{ mb: 2 }}>
      {isEditing ? (
        <HistoryName
          name={name}
          isEditing={isEditing}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          onNameUpdate={handleNameUpdate}
          onNameChange={handleNameChange}
        />
      ) : (
        <HistoryHeader
          name={record.name}
          timestamp={record.timestamp}
          results={record.results}
          isExpanded={isExpanded}
          onDelete={onDelete}
          onToggleExpanded={handleToggleExpanded}
          recordId={record.id}
          onDoubleClick={handleDoubleClick}
        />
      )}

      <Collapse in={isExpanded}>
        <HistoryResults results={record.results} imageSrc={record.imageSrc} />
      </Collapse>
    </Card>
  );
}
