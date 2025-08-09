import React from 'react';

interface AlignmentControlsProps {
  scale: number;
  rotation: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  colors: { background: string; text: string; border: string };
  accentColor: string;
}

export const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  scale,
  rotation,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onReset,
  colors,
  accentColor,
}) => {
  return (
    <div 
      className="mt-4 p-4 rounded-lg"
      style={{ 
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`
      }}
    >
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        <button
          onClick={onZoomOut}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: colors.background,
            color: colors.text,
            border: `1px solid ${colors.border}`
          }}
          disabled={scale <= 0.5}
        >
          🔍➖ Zoom Out
        </button>
        <button
          onClick={onZoomIn}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: colors.background,
            color: colors.text,
            border: `1px solid ${colors.border}`
          }}
          disabled={scale >= 3}
        >
          🔍➕ Zoom In
        </button>
        <button
          onClick={onRotateLeft}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: colors.background,
            color: colors.text,
            border: `1px solid ${colors.border}`
          }}
        >
          ↺ Rotate Left
        </button>
        <button
          onClick={onRotateRight}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: colors.background,
            color: colors.text,
            border: `1px solid ${colors.border}`
          }}
        >
          ↻ Rotate Right
        </button>
        <button
          onClick={onReset}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: accentColor,
            color: 'white'
          }}
        >
          🔄 Reset
        </button>
      </div>
      <div className="text-center text-xs" style={{ color: colors.text }}>
        Scale: {scale.toFixed(1)}x | Rotation: {rotation}°
      </div>
    </div>
  );
};

