import { forwardRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { EmptyState } from "./imageDisplay/components/EmptyState";
import { CalibrationStrips } from "./imageDisplay/components/CalibrationStrips";
import { TestAreas } from "./imageDisplay/components/TestAreas";
import { DebugSamplingOverlay, useDebugSampling } from "./debug";
import { useModeStore } from "../../state/modeStore";
import { PESTICIDE_CENTER_POINTS } from "../../utils/constants/roiConstants";

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
                
                {/* Guide dots overlay - always show */}
                {PESTICIDE_CENTER_POINTS.map((pesticide) => (
                  <Box key={pesticide.name}>
                    {/* Guide dot positioned at the center of the green box */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: `${pesticide.roi.x * 100}%`,
                        top: `${pesticide.roi.y * 100}%`,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "red",
                        border: "2px solid white",
                        zIndex: 15, // Higher than green boxes
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 0 8px rgba(255, 0, 0, 0.8)"
                      }}
                    />
                    
                    {/* Pesticide label */}
                    <Box
                      component="span"
                      sx={{
                        position: "absolute",
                        left: `${pesticide.roi.x * 100}%`,
                        top: `${pesticide.roi.y * 100}%`,
                        transform: "translate(-50%, -120%)",
                        color: "red",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        px: 0.5,
                        py: 0.2,
                        borderRadius: 0.5,
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        zIndex: 15,
                        border: "1px solid red"
                      }}
                    >
                      {pesticide.name}
                    </Box>
                  </Box>
                ))}
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
