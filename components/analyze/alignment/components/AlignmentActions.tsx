import React from "react";
import { Grid } from "@mui/material";
import { AppButton } from "../../../shared";

interface AlignmentActionsProps {
  imageLoaded: boolean;
  cropBounds: { x: number; y: number; width: number; height: number } | null;
  onBack: () => void;
  onAutoCrop: () => void;
  onConfirmCrop: () => void;
}

// Alignment Actions
export const AlignmentActions: React.FC<AlignmentActionsProps> = ({
  imageLoaded,
  cropBounds,
  onBack,
  onAutoCrop,
  onConfirmCrop
}) => {
  return (
    <Grid container spacing={2} sx={{ maxWidth: "md", mx: "auto", mt: 4 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <AppButton onClick={onBack} variant="outline" fullWidth>
          ← Back
        </AppButton>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <AppButton 
          onClick={onAutoCrop} 
          disabled={!imageLoaded}
          variant="secondary"
          fullWidth
        >
          🤖 Auto-Crop
        </AppButton>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <AppButton 
          onClick={onConfirmCrop} 
          disabled={!cropBounds || !imageLoaded}
          variant="primary"
          fullWidth
        >
          ✅ Confirm Crop
        </AppButton>
      </Grid>
    </Grid>
  );
};
