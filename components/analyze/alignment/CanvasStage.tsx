import React from 'react';

interface CanvasStageProps {
  canvasRef: React.RefObject<HTMLCanvasElement> | React.MutableRefObject<HTMLCanvasElement | null>;
  imageDisplaySize: { width: number; height: number };
  onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseMove: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseUp: () => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  canvasRef,
  imageDisplaySize,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  return (
    <canvas
      ref={canvasRef}
      className="block cursor-move"
      style={{
        width: imageDisplaySize.width,
        height: imageDisplaySize.height,
        maxWidth: '100%',
        maxHeight: '60vh'
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      onMouseMove={onMouseMove}
      onTouchMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp}
    />
  );
};

