import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';

interface PixelPickerProps {
  imageRef: React.RefObject<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  onPixelSelect?: (
    x: number,
    y: number,
    rgb: { r: number; g: number; b: number }
  ) => void;
}

interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
}

export const PixelPicker: React.FC<PixelPickerProps> = ({
  imageRef,
  canvasRef,
  isActive,
  onPixelSelect,
}) => {
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pixelData, setPixelData] = useState<PixelData[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Magnification settings
  const MAGNIFICATION = 8; // 8x zoom
  const GRID_SIZE = 9; // 9x9 grid of pixels
  const CENTER_INDEX = Math.floor(GRID_SIZE / 2); // Center pixel index

  // Get pixel data from original image at specific coordinates
  const getPixelData = useCallback(
    (canvasX: number, canvasY: number): PixelData[] => {
      const canvas = canvasRef.current;
      const image = imageRef.current;

      if (!canvas || !image) {
        console.log('PixelPicker: Missing canvas or image ref');
        return [];
      }

      // Sample directly from the canvas that's already drawn with transformations
      // This ensures we're sampling from what the user actually sees
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.log('PixelPicker: Could not get canvas context');
        return [];
      }

      console.log('PixelPicker: Sampling pixels at canvas coordinates:', {
        canvasX,
        canvasY,
      });
      console.log('PixelPicker: Canvas dimensions:', {
        width: canvas.width,
        height: canvas.height,
      });

      const pixels: PixelData[] = [];
      const halfGrid = Math.floor(GRID_SIZE / 2);

      // Sample pixels in a grid around the cursor directly from the canvas
      for (let dy = -halfGrid; dy <= halfGrid; dy++) {
        for (let dx = -halfGrid; dx <= halfGrid; dx++) {
          const pixelX = Math.round(canvasX + dx);
          const pixelY = Math.round(canvasY + dy);

          // Ensure pixel is within canvas bounds
          if (
            pixelX >= 0 &&
            pixelX < canvas.width &&
            pixelY >= 0 &&
            pixelY < canvas.height
          ) {
            const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
            const data = imageData.data;

            console.log(
              `PixelPicker: Pixel at (${pixelX}, ${pixelY}): RGB(${data[0]}, ${data[1]}, ${data[2]})`
            );

            pixels.push({
              x: dx + halfGrid,
              y: dy + halfGrid,
              r: data[0],
              g: data[1],
              b: data[2],
            });
          } else {
            // Out of bounds - add transparent pixel
            pixels.push({
              x: dx + halfGrid,
              y: dy + halfGrid,
              r: 0,
              g: 0,
              b: 0,
            });
          }
        }
      }

      console.log('PixelPicker: Total pixels sampled:', pixels.length);
      return pixels;
    },
    [canvasRef]
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isActive || !canvasRef.current) return;

      console.log('PixelPicker: Mouse move detected', {
        isActive,
        canvasRef: !!canvasRef.current,
      });

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      // Calculate mouse position relative to canvas
      const canvasX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const canvasY = ((e.clientY - rect.top) / rect.height) * canvas.height;

      setMousePosition({ x: e.clientX, y: e.clientY });

      // Get pixel data around cursor
      const pixels = getPixelData(canvasX, canvasY);
      console.log('PixelPicker: Got pixel data', pixels.length);
      setPixelData(pixels);
      setShowPicker(true);
    },
    [isActive, canvasRef, getPixelData]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setShowPicker(false);
    setMousePosition(null);
  }, []);

  // Handle click to select pixel
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isActive || !canvasRef.current || !pixelData.length) return;

      const canvas = canvasRef.current;
      const image = imageRef.current;
      const rect = canvas.getBoundingClientRect();

      // Calculate click position relative to canvas
      const canvasX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const canvasY = ((e.clientY - rect.top) / rect.height) * canvas.height;

      // Get center pixel data
      const centerPixel = pixelData.find(
        p => p.x === CENTER_INDEX && p.y === CENTER_INDEX
      );
      if (centerPixel && onPixelSelect && image) {
        // Convert canvas coordinates back to image coordinates
        // This accounts for the transformations applied to the canvas
        const imageX = (canvasX / canvas.width) * image.naturalWidth;
        const imageY = (canvasY / canvas.height) * image.naturalHeight;

        console.log('PixelPicker: Click at canvas coordinates:', {
          canvasX,
          canvasY,
        });
        console.log('PixelPicker: Converted to image coordinates:', {
          imageX,
          imageY,
        });
        console.log('PixelPicker: Selected pixel RGB:', {
          r: centerPixel.r,
          g: centerPixel.g,
          b: centerPixel.b,
        });

        onPixelSelect(imageX, imageY, {
          r: centerPixel.r,
          g: centerPixel.g,
          b: centerPixel.b,
        });
      }
    },
    [isActive, canvasRef, pixelData, onPixelSelect, imageRef]
  );

  // Position the pixel picker next to the image
  const getPickerPosition = () => {
    if (!mousePosition || !canvasRef.current) return {};

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const pickerWidth = GRID_SIZE * MAGNIFICATION;
    const pickerHeight = GRID_SIZE * MAGNIFICATION;
    const offset = 20;

    // Position to the right of the image
    let left = rect.right + offset;
    let top = rect.top + (rect.height - pickerHeight) / 2;

    // If it would go off screen, position to the left
    if (left + pickerWidth > window.innerWidth) {
      left = rect.left - pickerWidth - offset;
    }

    // Ensure it stays within viewport vertically
    if (top < 0) {
      top = rect.top + offset;
    }
    if (top + pickerHeight > window.innerHeight) {
      top = window.innerHeight - pickerHeight - offset;
    }

    return {
      position: 'fixed' as const,
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 1000,
    };
  };

  // Always render when active, even if no pixel data yet
  if (!isActive) return null;

  return (
    <>
      {/* Mouse event handlers - positioned relative to viewport to prevent layout shifts */}
      {isActive && showPicker && (
        <Box
          sx={{
            position: 'fixed', // Use fixed positioning relative to viewport
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'auto',
            zIndex: 10,
            backgroundColor: 'transparent',
          }}
          onMouseMove={e => {
            e.stopPropagation();
            handleMouseMove(e);
          }}
          onMouseLeave={e => {
            e.stopPropagation();
            handleMouseLeave();
          }}
          onClick={e => {
            e.stopPropagation();
            handleClick(e);
          }}
        />
      )}

      {/* Pixel picker display */}
      <Box
        ref={pickerRef}
        sx={{
          ...getPickerPosition(),
          width: GRID_SIZE * MAGNIFICATION,
          height: GRID_SIZE * MAGNIFICATION,
          border: '2px solid #fff',
          borderRadius: 1,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1px',
          backgroundColor: '#000',
        }}
      >
        {pixelData.length > 0
          ? pixelData.map((pixel, index) => {
              const isCenter =
                pixel.x === CENTER_INDEX && pixel.y === CENTER_INDEX;
              return (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                    border: isCenter
                      ? '2px solid #ff0000'
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    width: MAGNIFICATION,
                    height: MAGNIFICATION,
                    minWidth: MAGNIFICATION,
                    minHeight: MAGNIFICATION,
                  }}
                />
              );
            })
          : // Show placeholder when no pixel data
            Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: '#333',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  width: MAGNIFICATION,
                  height: MAGNIFICATION,
                  minWidth: MAGNIFICATION,
                  minHeight: MAGNIFICATION,
                }}
              />
            ))}
      </Box>

      {/* RGB info display */}
      {pixelData.length > 0 &&
        (() => {
          const pickerPos = getPickerPosition();
          const topValue =
            typeof pickerPos.top === 'string'
              ? parseInt(pickerPos.top.replace('px', ''))
              : 0;
          return (
            <Box
              sx={{
                position: 'fixed',
                top: `${topValue + GRID_SIZE * MAGNIFICATION + 10}px`,
                left: pickerPos.left,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 1,
                fontSize: '12px',
                fontFamily: 'monospace',
                zIndex: 1001,
                pointerEvents: 'none',
              }}
            >
              {(() => {
                const centerPixel = pixelData.find(
                  p => p.x === CENTER_INDEX && p.y === CENTER_INDEX
                );
                return centerPixel
                  ? `RGB(${centerPixel.r}, ${centerPixel.g}, ${centerPixel.b})`
                  : '';
              })()}
            </Box>
          );
        })()}

      {/* Pixel picker status indicator */}
      <Box
        sx={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 107, 0, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: 1,
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1002,
          pointerEvents: 'none',
          border: '2px solid #ff6b00',
        }}
      >
        🎯 Pixel Picker Active
      </Box>
    </>
  );
};
