import React from 'react';
import { Box } from '@mui/material';
import { PesticideGuideDots } from './overlays/components/PesticideGuideDots';
import { CameraTestAreas } from './overlays/components/CameraTestAreas';
import { StripModeBorder } from './overlays/components/StripModeBorder';
import { CalibrationStrips } from '../imageDisplay/components/CalibrationStrips';
import { useModeStore } from '../../../state/modeStore';

interface CameraOverlaysProps {
  videoWidth: number;
  videoHeight: number;
}

export const CameraOverlays: React.FC<CameraOverlaysProps> = ({
  videoWidth,
  videoHeight,
}) => {
  const { detectionMode } = useModeStore();
  
  // Use default dimensions if video dimensions are not available yet
  const displayWidth = videoWidth || 1920;
  const displayHeight = videoHeight || 1080;

  return (
    <Box sx={{ position: 'absolute', inset: 0 }}>
      {/* Green ROI boxes for pesticide test areas - always visible */}
      <CameraTestAreas videoWidth={displayWidth} videoHeight={displayHeight} />

      {/* Pesticide guide dots at specific coordinates - always visible */}
      <PesticideGuideDots
        videoWidth={displayWidth}
        videoHeight={displayHeight}
      />

      {/* Calibration strips - only visible in strip mode */}
      {detectionMode === 'strip' && <CalibrationStrips />}

      {/* Strip mode border - only visible in strip mode */}
      {detectionMode === 'strip' && (
        <StripModeBorder
          videoWidth={displayWidth}
          videoHeight={displayHeight}
        />
      )}
    </Box>
  );
};
