import React, { useState } from 'react';
import { useCalibrationStore } from '../../state/calibrationStore';
import { PREDEFINED_PESTICIDES } from '../../state/pesticideStore';
import { AppButton } from '../shared';

export const CalibrationSettings: React.FC = () => {
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
    if (window.confirm('Are you sure you want to reset all calibration settings to default?')) {
      resetAll();
      setLocalCal(Object.fromEntries(
        PREDEFINED_PESTICIDES.map(p => [p.name, p.curve.map(pt => pt.concentration)])
      ));
      setEditing(null);
    }
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
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, pesticide: string) => {
    if (e.key === 'Enter') {
      setEditingName(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-cyan-400 mb-2">Calibration Strip Settings</h2>
      <p className="text-gray-300 text-sm mb-4">Set the calibration concentrations for each pesticide. Double-click the name to edit. You can reset to default at any time.</p>
      <div className="space-y-8">
        {Object.keys(localCal).map((pesticide, idx) => (
          <div key={pesticide} className="bg-gray-800 p-4 rounded-xl shadow">
            <div className="flex items-center justify-between mb-2">
              <div>
                {editingName === pesticide ? (
                  <input
                    type="text"
                    className="font-semibold text-cyan-300 text-lg bg-gray-900 rounded px-2 py-1 border border-cyan-400 focus:outline-none"
                    value={nameEdits[pesticide]}
                    autoFocus
                    onChange={e => handleNameChange(pesticide, e.target.value)}
                    onBlur={() => handleNameBlur(pesticide)}
                    onKeyDown={e => handleNameKeyDown(e, pesticide)}
                    style={{ minWidth: 80 }}
                  />
                ) : (
                  <h3
                    className="font-semibold text-cyan-300 text-lg cursor-pointer select-none"
                    onDoubleClick={() => handleNameDoubleClick(pesticide)}
                    title="Double-click to edit name"
                  >
                    {nameEdits[pesticide]}
                  </h3>
                )}
              </div>
              <div className="flex gap-2">
                <AppButton onClick={() => setEditing(pesticide)} variant="secondary" disabled={editing === pesticide}>Edit</AppButton>
                <AppButton onClick={() => handleReset(pesticide)} variant="danger">Reset</AppButton>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {localCal[pesticide].map((val: number, idx: number) => (
                <div key={idx} className="flex flex-col items-center">
                  <label className="text-xs text-gray-400">#{idx + 1}</label>
                  <input
                    type="number"
                    className="w-20 px-2 py-1 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={val}
                    disabled={editing !== pesticide}
                    onChange={e => handleInputChange(pesticide, idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
            {editing === pesticide && (
              <div className="mt-3 flex gap-2">
                <AppButton onClick={() => handleSave(pesticide)}>Save</AppButton>
                <AppButton onClick={() => setEditing(null)} variant="secondary">Cancel</AppButton>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <AppButton onClick={handleResetAll} variant="danger">Reset All to Default</AppButton>
      </div>
    </div>
  );
}; 