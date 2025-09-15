import React from "react";
import { Box, Paper, Backdrop, CircularProgress, Typography } from "@mui/material";
import { CanvasStage } from "../CanvasStage";
import { CropOverlay } from "../CropOverlay";
import { iGEMColors } from "../../../../state/themeStore";

interface AlignmentCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  imageDisplaySize: { width: number; height: number };
  cropBounds: { x: number; y: number; width: number; height: number } | null;
  imageLoaded: boolean;
  isAutoDetecting: boolean;
  colors: { surface: string; border: string };
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseMove: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseUp: () => void;
  onImageLoad: () => void;
}

// Alignment Canvas
export const AlignmentCanvas: React.FC<AlignmentCanvasProps> = ({
  canvasRef,
  imageRef,
  imageDisplaySize,
  cropBounds,
  imageLoaded,
  isAutoDetecting,
  colors,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onImageLoad
}) => {
  return (
    <Paper
      sx={{
        position: "relative",
        border: 2,
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: "background.paper",
        borderColor: "divider"
      }}
    >
      <CanvasStage 
        canvasRef={canvasRef}
        imageDisplaySize={imageDisplaySize}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
      
      {/* Hidden image for reference */}
      <Box
        component="img"
        ref={imageRef}
        onLoad={onImageLoad}
        crossOrigin="anonymous"
        sx={{ display: "none" }}
      />
      
      {/* Crop overlay */}
      {cropBounds && imageLoaded && canvasRef.current && (
        <CropOverlay 
          cropBounds={cropBounds}
          canvasWidth={canvasRef.current.width}
          canvasHeight={canvasRef.current.height}
          primaryColor={iGEMColors.primary}
          surfaceColor={colors.surface}
          borderColor={colors.border}
        />
      )}
      
      {/* Loading indicator */}
      <Backdrop
        open={isAutoDetecting}
        sx={{ 
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress 
            size={32}
            sx={{ 
              color: iGEMColors.primary,
              mb: 2
            }}
          />
          <Typography variant="body1" sx={{ color: "white" }}>
            Detecting test kit...
          </Typography>
        </Box>
      </Backdrop>
    </Paper>
  );
};
