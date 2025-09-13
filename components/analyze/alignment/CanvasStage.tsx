import React from 'react';

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageDisplaySize: { width: number; height: number };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  canvasRef,
  imageDisplaySize,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) => {
  return (
    <canvas
      ref={canvasRef}
      width={imageDisplaySize.width}
      height={imageDisplaySize.height}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        cursor: 'crosshair'
      }}
    />
  );
};
