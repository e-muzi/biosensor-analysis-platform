import React from "react";
import { Card, CardContent, Box } from "@mui/material";
import { PesticideName } from "./PesticideName";
import { PesticideActions } from "./PesticideActions";
import { CalibrationInputs } from "./CalibrationInputs";
import { CalibrationEditActions } from "./CalibrationEditActions";

interface PesticideCardProps {
  pesticide: string;
  values: number[];
  editing: string | null;
  editingName: string | null;
  nameEdits: Record<string, string>;
  onInputChange: (pesticide: string, idx: number, value: string) => void;
  onEdit: (pesticide: string) => void;
  onReset: (pesticide: string) => void;
  onSave: (pesticide: string) => void;
  onCancel: () => void;
  onNameDoubleClick: (pesticide: string) => void;
  onNameChange: (pesticide: string, value: string) => void;
  onNameBlur: (pesticide: string) => void;
  onNameKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, pesticide: string) => void;
}

export const PesticideCard: React.FC<PesticideCardProps> = ({
  pesticide,
  values,
  editing,
  editingName,
  nameEdits,
  onInputChange,
  onEdit,
  onReset,
  onSave,
  onCancel,
  onNameDoubleClick,
  onNameChange,
  onNameBlur,
  onNameKeyDown
}) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <PesticideName
            name={pesticide}
            editingName={editingName}
            nameEdits={nameEdits}
            onNameDoubleClick={onNameDoubleClick}
            onNameChange={onNameChange}
            onNameBlur={onNameBlur}
            onNameKeyDown={onNameKeyDown}
          />
          <PesticideActions
            pesticide={pesticide}
            editing={editing}
            onEdit={onEdit}
            onReset={onReset}
          />
        </Box>
        
        <CalibrationInputs
          pesticide={pesticide}
          values={values}
          editing={editing}
          onInputChange={onInputChange}
        />
        
        <CalibrationEditActions
          onSave={() => onSave(pesticide)}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
};
