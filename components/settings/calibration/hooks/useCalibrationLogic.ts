import { useState } from "react";
import { useCalibrationStore } from "../../../../state/calibrationStore";
import { PREDEFINED_PESTICIDES } from "../../../../state/pesticideStore";

export function useCalibrationLogic() {
  const { userCalibrations, setCalibration, resetCalibration, resetAll } = useCalibrationStore();
  
  const [localCal, setLocalCal] = useState(() => {
    // Deep copy to avoid direct mutation
    return Object.fromEntries(
      PREDEFINED_PESTICIDES.map(p => [p.name, [...(userCalibrations[p.name] || p.curve.map(pt => pt.concentration))]])
    );
  });
  
  const [editing, setEditing] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameEdits, setNameEdits] = useState(() => {
    // Map of pesticide name to display name
    return Object.fromEntries(PREDEFINED_PESTICIDES.map(p => [p.name, p.name]));
  });
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleInputChange = (pesticide: string, idx: number, value: string) => {
    setLocalCal(prev => ({
      ...prev,
      [pesticide]: prev[pesticide].map((v: number, i: number) => i === idx ? Number(value) : v)
    }));
  };

  const handleSave = (pesticide: string) => {
    setCalibration(pesticide, localCal[pesticide]);
    setEditing(null);
  };

  const handleReset = (pesticide: string) => {
    resetCalibration(pesticide);
    setLocalCal(prev => ({
      ...prev,
      [pesticide]: PREDEFINED_PESTICIDES.find(p => p.name === pesticide)?.curve.map(pt => pt.concentration) || []
    }));
    setEditing(null);
  };

  const handleResetAll = () => {
    resetAll();
    setLocalCal(Object.fromEntries(
      PREDEFINED_PESTICIDES.map(p => [p.name, p.curve.map(pt => pt.concentration)])
    ));
    setEditing(null);
    setShowResetDialog(false);
  };

  // Double-click to edit pesticide name
  const handleNameDoubleClick = (pesticide: string) => {
    setEditingName(pesticide);
  };

  // Save new name on blur or Enter
  const handleNameChange = (pesticide: string, value: string) => {
    setNameEdits(prev => ({ ...prev, [pesticide]: value }));
  };
  
  const handleNameBlur = (pesticide: string) => {
    setEditingName(null);
  };
  
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, pesticide: string) => {
    if (e.key === "Enter") {
      setEditingName(null);
    }
  };

  return {
    localCal,
    editing,
    editingName,
    nameEdits,
    showResetDialog,
    setShowResetDialog,
    handleInputChange,
    handleSave,
    handleReset,
    handleResetAll,
    handleNameDoubleClick,
    handleNameChange,
    handleNameBlur,
    handleNameKeyDown,
    setEditing
  };
}
