import React from "react";
import { Paper, Box, IconButton, Fab, CircularProgress } from "@mui/material";
import { 
  FlashOn as FlashOnIcon,
  FlashOff as FlashOffIcon,
  Close as CloseIcon,
  CameraAlt as CameraAltIcon
} from "@mui/icons-material";

interface CameraControlsProps {
  flashEnabled: boolean;
  isCapturing: boolean;
  onToggleFlash: () => void;
  onCapture: () => void;
  onClose: () => void;
}

// Camera Controls - Full camera view
export const CameraControls: React.FC<CameraControlsProps> = ({
  flashEnabled,
  isCapturing,
  onToggleFlash,
  onCapture,
  onClose
}) => {
  return (
    <Paper
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 0
      }}
    >
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        maxWidth: "md", 
        mx: "auto" 
      }}>
        {/* Flash toggle */}
        <IconButton
          onClick={onToggleFlash}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }
          }}
        >
          {flashEnabled ? <FlashOnIcon /> : <FlashOffIcon />}
        </IconButton>

        {/* Capture button */}
        <Fab
          onClick={onCapture}
          disabled={isCapturing}
          sx={{
            width: 64,
            height: 64,
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            "&:disabled": {
              backgroundColor: "grey.600",
            }
          }}
        >
          {isCapturing ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            <CameraAltIcon sx={{ fontSize: 32, color: "white" }} />
          )}
        </Fab>

        {/* Cancel button */}
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};
