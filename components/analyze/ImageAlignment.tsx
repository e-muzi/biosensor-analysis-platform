import { Box, Container, Typography } from "@mui/material";
import { CanvasStage } from "./alignment/CanvasStage";
import { AlignmentControls } from "./alignment/Controls";
import { useAlignmentCanvas } from "./alignment/useAlignmentCanvas";
import { useThemeStore } from "../../state/themeStore";

interface ImageAlignmentProps {
  imageSrc: string;
  onConfirm: (alignedImageSrc: string) => void;
}

export function ImageAlignment({
  imageSrc,
  onConfirm,
}: ImageAlignmentProps) {
  const { getColors } = useThemeStore();
  const colors = getColors();

  const {
    canvasRef,
    imageRef,
    imageDisplaySize,
    scale,
    rotation,
    isDetecting,
    detectedBounds,
    handleAutoDetect,
    handleConfirmCrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useAlignmentCanvas(imageSrc, onConfirm);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Align Test Kit
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Adjust the image position and crop to focus on the test kit
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <CanvasStage
          canvasRef={canvasRef}
          imageSrc={imageSrc}
          imageDisplaySize={imageDisplaySize}
          scale={scale}
          rotation={rotation}
          isDetecting={isDetecting}
          detectedBounds={detectedBounds}
          onAutoDetect={handleAutoDetect}
          onConfirm={handleConfirmCrop}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        <AlignmentControls
          scale={scale}
          rotation={rotation}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onRotateLeft={() => {}}
          onRotateRight={() => {}}
          onReset={() => {}}
          colors={colors}
          accentColor="#FFD700"
        />
      </Box>
    </Container>
  );
}
