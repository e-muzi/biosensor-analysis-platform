import { forwardRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { EmptyState } from "./imageDisplay/components/EmptyState";
import { CalibrationStrips } from "./imageDisplay/components/CalibrationStrips";
import { TestAreas } from "./imageDisplay/components/TestAreas";
import { DebugSamplingOverlay, useDebugSampling } from "./debug";
import { useModeStore } from "../../state/modeStore";

interface ImageDisplayProps {
  imageSrc: string | null;
  showROIs?: boolean;
}

export const ImageDisplay = forwardRef<HTMLImageElement, ImageDisplayProps>(
  ({ imageSrc, showROIs = true }, ref) => {
    const { detectionMode } = useModeStore();
    const { showDebug, samplingResults, toggleDebug, performSampling, clearSamplingResults } = useDebugSampling();
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // Perform sampling when image loads and debug is enabled
    useEffect(() => {
      console.log('Debug: useEffect triggered', { imageSrc: !!imageSrc, showDebug, ref: !!ref, refCurrent: ref && 'current' in ref ? !!ref.current : false });
      
      if (imageSrc && showDebug && ref && 'current' in ref && ref.current) {
        const img = ref.current as HTMLImageElement;
        console.log('Debug: Image element found', { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, width: img.width, height: img.height });
        
        if (img.complete && img.naturalWidth > 0) {
          console.log('Debug: Performing sampling for image', img.naturalWidth, 'x', img.naturalHeight);
          // Create canvas to get context for sampling
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const results = performSampling(ctx);
            console.log('Debug: Sampling results', results);
            setImageDimensions({ width: img.width, height: img.height });
          }
        } else {
          console.log('Debug: Image not ready for sampling', { complete: img.complete, naturalWidth: img.naturalWidth });
        }
      } else if (!showDebug) {
        clearSamplingResults();
      }
    }, [imageSrc, showDebug, performSampling, clearSamplingResults, ref]);

    // Handle image load to get dimensions
    const handleImageLoad = () => {
      if (ref && 'current' in ref && ref.current) {
        const img = ref.current as HTMLImageElement;
        console.log('Debug: Image loaded', img.naturalWidth, 'x', img.naturalHeight, 'displayed:', img.width, 'x', img.height);
        setImageDimensions({ width: img.width, height: img.height });
        
        if (showDebug) {
          console.log('Debug: Performing sampling on image load');
          // Create canvas to get context for sampling
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const results = performSampling(ctx);
            console.log('Debug: Sampling results on load', results);
          }
        }
      }
    };

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
              onLoad={handleImageLoad}
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
            <DebugSamplingOverlay
              samplingResults={samplingResults}
              showDebug={showDebug}
              onToggleDebug={toggleDebug}
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </Box>
    );
  }
);
