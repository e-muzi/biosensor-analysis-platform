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
    const { 
      showDebug, 
      samplingResults, 
      manualClickResult,
      isPixelPickerMode,
      toggleDebug, 
      togglePixelPickerMode,
      performSampling, 
      handleImageClick,
      clearSamplingResults 
    } = useDebugSampling();
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // Perform sampling when image loads and debug is enabled
    useEffect(() => {
      if (imageSrc && showDebug && ref && 'current' in ref && ref.current) {
        const img = ref.current as HTMLImageElement;
        
        if (img.complete && img.naturalWidth > 0) {
          // Create canvas to get context for sampling
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d', { 
            premultipliedAlpha: false,
            willReadFrequently: true 
          }) as CanvasRenderingContext2D;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            performSampling(ctx);
            setImageDimensions({ width: img.width, height: img.height });
          }
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
          const ctx = canvas.getContext('2d', { 
            premultipliedAlpha: false,
            willReadFrequently: true 
          }) as CanvasRenderingContext2D;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const results = performSampling(ctx);
            console.log('Debug: Sampling results on load', results);
          }
        }
      }
    };

    // Handle image click for pixel picking
    const handleImageClickEvent = (e: React.MouseEvent<HTMLImageElement>) => {
      if (!isPixelPickerMode || !imageSrc) return;
      
      const img = e.currentTarget;
      const rect = img.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      console.log('Debug: Image clicked at', clickX, clickY, 'image dimensions:', img.width, img.height);
      
      // Create canvas to get context for sampling
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { 
        premultipliedAlpha: false,
        willReadFrequently: true 
      }) as CanvasRenderingContext2D;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        handleImageClick(ctx, clickX, clickY, img.width, img.height);
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
              onClick={handleImageClickEvent}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                cursor: isPixelPickerMode ? 'crosshair' : 'default',
                position: "relative",
                zIndex: 0,
                pointerEvents: "auto"
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
              manualClickResult={manualClickResult}
              showDebug={showDebug}
              isPixelPickerMode={isPixelPickerMode}
              onToggleDebug={toggleDebug}
              onTogglePixelPicker={togglePixelPickerMode}
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
