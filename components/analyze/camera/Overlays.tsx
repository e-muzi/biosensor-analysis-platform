import React from 'react';
import { CALIBRATION_STRIPS, PESTICIDE_ROIS } from '../../../utils/analysis';

interface CameraOverlaysProps {
  detectedBounds: { x: number; y: number; width: number; height: number } | null;
  videoWidth: number;
  videoHeight: number;
}

export const CameraOverlays: React.FC<CameraOverlaysProps> = ({ detectedBounds, videoWidth, videoHeight }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[90vmin] h-[60vmin] max-w-[600px] max-h-[400px]">
        <div className="absolute inset-0 border-4 border-cyan-400 border-dashed rounded-lg">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-cyan-400 bg-gray-900 bg-opacity-80 px-3 py-1 text-sm rounded-full font-medium">
            Test Kit Area
          </div>
        </div>

        {detectedBounds && (
          <div 
            className="absolute border-2 border-green-500 bg-green-500 bg-opacity-20"
            style={{
              left: `${(detectedBounds.x / (videoWidth || 1)) * 100}%`,
              top: `${(detectedBounds.y / (videoHeight || 1)) * 100}%`,
              width: `${(detectedBounds.width / (videoWidth || 1)) * 100}%`,
              height: `${(detectedBounds.height / (videoHeight || 1)) * 100}%`
            }}
          >
            <div className="absolute -top-6 left-0 text-green-400 bg-gray-900 bg-opacity-80 px-2 py-1 text-xs rounded">
              Detected Area
            </div>
          </div>
        )}

        {CALIBRATION_STRIPS.map((strip) => (
          <div key={`cal-${strip.name}`} className="absolute">
            <div 
              className="border-2 border-green-400 border-dashed bg-green-400 bg-opacity-10"
              style={{ 
                top: `${strip.roi.y * 100}%`, 
                left: `${strip.roi.x * 100}%`, 
                width: `${strip.roi.width * 100}%`, 
                height: `${strip.roi.height * 100}%` 
              }}
            >
              <div className="absolute -top-6 left-0 text-green-400 bg-gray-900 bg-opacity-80 px-2 py-1 text-xs rounded">
                {strip.name} Cal
              </div>
            </div>
          </div>
        ))}

        {PESTICIDE_ROIS.map(({name, roi}) => (
          <div key={`test-${name}`} className="absolute">
            <div 
              className="border-2 border-cyan-400 border-dashed bg-cyan-400 bg-opacity-10"
              style={{ 
                top: `${roi.y * 100}%`, 
                left: `${roi.x * 100}%`, 
                width: `${roi.width * 100}%`, 
                height: `${roi.height * 100}%` 
              }}
            >
              <div className="absolute -top-6 left-0 text-cyan-400 bg-gray-900 bg-opacity-80 px-2 py-1 text-xs rounded">
                {name} Test
              </div>
            </div>
          </div>
        ))}

        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>
      </div>
    </div>
  );
};

