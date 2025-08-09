import React from 'react';

interface CropOverlayProps {
  cropBounds: { x: number; y: number; width: number; height: number };
  canvasWidth: number;
  canvasHeight: number;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropBounds,
  canvasWidth,
  canvasHeight,
  primaryColor,
  surfaceColor,
  borderColor,
}) => {
  return (
    <div
      className="absolute border-2 pointer-events-none"
      style={{
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}30`,
        left: `${(cropBounds.x / canvasWidth) * 100}%`,
        top: `${(cropBounds.y / canvasHeight) * 100}%`,
        width: `${(cropBounds.width / canvasWidth) * 100}%`,
        height: `${(cropBounds.height / canvasHeight) * 100}%`
      }}
    >
      <div 
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 text-sm rounded-full font-medium"
        style={{ 
          color: primaryColor,
          backgroundColor: surfaceColor,
          border: `1px solid ${borderColor}`
        }}
      >
        Test Kit Area
      </div>
    </div>
  );
};

