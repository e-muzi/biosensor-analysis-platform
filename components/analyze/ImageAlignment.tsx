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
    imageDisplaySize,
    scale,
    rotation,
    imageTransform,
    isDragging,
    handleConfirm,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useAlignmentCanvas(imageSrc, onConfirm);

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 8 }}>
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
          imageTransform={imageTransform}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
          <button
            onClick={handleConfirm}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Confirm Alignment
          </button>
        </Box>
      </Box>
    </Container>
  );
}
