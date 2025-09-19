import React, { useEffect, useRef } from 'react';
import { PESTICIDE_ROIS, CALIBRATION_STRIPS } from '../../../utils/constants/roiConstants';

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageSrc: string;
  imageDisplaySize: { width: number; height: number };
  scale: number;
  rotation: number;
  imageTransform: { x: number; y: number; scale?: number };
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  canvasRef,
  imageSrc,
  imageDisplaySize,
  scale,
  rotation,
  imageTransform,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  // Draw the image and overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d', { 
      premultipliedAlpha: false,
      willReadFrequently: true 
    }) as CanvasRenderingContext2D;
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(imageTransform.x, imageTransform.y);
    ctx.scale(scale * (imageTransform.scale || 1), scale * (imageTransform.scale || 1));
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw the image
    ctx.drawImage(image, 0, 0, imageDisplaySize.width, imageDisplaySize.height);

    // Restore context for overlay
    ctx.restore();

    // Draw overlay with TEST_KIT_LAYOUT positions
    drawOverlay(ctx, canvas.width, canvas.height);
  }, [imageSrc, imageDisplaySize, scale, rotation, imageTransform, isDragging]);

  const drawOverlay = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    // Draw calibration strips (blue boxes)
    CALIBRATION_STRIPS.forEach((strip) => {
      const x = strip.roi.x * canvasWidth;
      const y = strip.roi.y * canvasHeight;
      const width = strip.roi.width * canvasWidth;
      const height = strip.roi.height * canvasHeight;

      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Add label
      ctx.fillStyle = '#2196F3';
      ctx.font = '12px Arial';
      ctx.fillText(strip.name, x, y - 5);
    });

    // Draw pesticide test areas (green boxes)
    PESTICIDE_ROIS.forEach((pesticide) => {
      const x = pesticide.roi.x * canvasWidth;
      const y = pesticide.roi.y * canvasHeight;
      const width = pesticide.roi.width * canvasWidth;
      const height = pesticide.roi.height * canvasHeight;

      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Add label
      ctx.fillStyle = '#4CAF50';
      ctx.font = '12px Arial';
      ctx.fillText(pesticide.name, x, y - 5);
    });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imageRef}
        src={imageSrc}
        style={{ display: 'none' }}
        onLoad={() => {
          // Trigger redraw when image loads
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { 
              premultipliedAlpha: false,
              willReadFrequently: true 
            }) as CanvasRenderingContext2D;
            if (ctx) {
              drawOverlay(ctx, canvas.width, canvas.height);
            }
          }
        }}
        alt="Test kit"
      />
      <canvas
        ref={canvasRef}
        width={imageDisplaySize.width}
        height={imageDisplaySize.height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          border: '2px solid #ddd',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};
