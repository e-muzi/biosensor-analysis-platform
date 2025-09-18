import { forwardRef } from "react";
import { Box } from "@mui/material";
import { EmptyState } from "./imageDisplay/components/EmptyState";
import { CalibrationStrips } from "./imageDisplay/components/CalibrationStrips";
import { TestAreas } from "./imageDisplay/components/TestAreas";
import { useModeStore } from "../../state/modeStore";

interface ImageDisplayProps {
  imageSrc: string | null;
  showROIs?: boolean;
}

export const ImageDisplay = forwardRef<HTMLImageElement, ImageDisplayProps>(
  ({ imageSrc, showROIs = true }, ref) => {
    const { detectionMode } = useModeStore();

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "md",
          aspectRatio: "1/1",
          borderRadius: 1,
          overflow: "hidden",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: 2,
          borderStyle: "dashed",
          borderColor: "divider",
          backgroundColor: "background.paper"
        }}
      >
        {imageSrc ? (
          <>
            <Box
              component="img"
              ref={ref}
              src={imageSrc}
              alt="Sample"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
            {showROIs && (
              <>
                {detectionMode === 'strip' && <CalibrationStrips />}
                <TestAreas />
              </>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </Box>
    );
  }
);
