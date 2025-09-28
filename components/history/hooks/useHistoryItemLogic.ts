import { useState } from 'react';

export function useHistoryItemLogic(
  initialName: string,
  onNameUpdate?: (newName: string) => void
) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameUpdate = () => {
    if (name.trim() !== '') {
      onNameUpdate?.(name.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameUpdate();
    }
    if (e.key === 'Escape') {
      setName(initialName);
      setIsEditing(false);
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return {
    isExpanded,
    isEditing,
    name,
    handleNameChange,
    handleNameUpdate,
    handleKeyDown,
    handleToggleExpanded,
    handleStartEditing,
    handleDoubleClick,
  };
}
