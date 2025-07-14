import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { AppButton } from '../shared';
import { PESTICIDE_ROIS, CALIBRATION_STRIPS } from '../../utils/analysis';

interface ImageAlignmentProps {
  imageSrc: string;
  onConfirm: (alignedImageSrc: string) => void;
  onBack: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageAlignment: React.FC<ImageAlignmentProps> = ({ imageSrc, onConfirm, onBack }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Load image to get dimensions
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const onCropComplete = useCallback((_croppedArea: CropArea, _croppedAreaPixels: CropArea) => {
    // We don't need to track crop area since we're not actually cropping
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getTransformedImage = async (
    imageSrc: string,
    rotation = 0
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to match image dimensions
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Apply rotation if needed
    if (rotation !== 0) {
      // Calculate the size needed to accommodate the rotated image
      const angle = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      
      const newWidth = image.naturalWidth * cos + image.naturalHeight * sin;
      const newHeight = image.naturalWidth * sin + image.naturalHeight * cos;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Move to center and rotate
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(angle);
      ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
    } else {
      // No rotation, just draw the image
      ctx.drawImage(image, 0, 0);
    }

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const handleConfirm = async () => {
    try {
      // Only apply rotation, no cropping
      const transformedImage = await getTransformedImage(imageSrc, rotation);
      onConfirm(transformedImage);
    } catch (error) {
      console.error('Error transforming image:', error);
      // Fallback to original image if transformation fails
      onConfirm(imageSrc);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Align Image with Analysis Frame</h2>
      
      <div className="w-full max-w-2xl">
        <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden" style={{ border: 'none' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={undefined} // Remove aspect ratio constraint
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            showGrid={false}
            objectFit="contain" // Use contain to show full image
            classes={{
              containerClassName: "w-full h-full",
              mediaClassName: "w-full h-full object-contain"
            }}
          />
          
          {/* Overlay for analysis frame */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Calibration strips */}
            {CALIBRATION_STRIPS.map((strip) => (
              <div key={`overlay-strip-${strip.name}`}>
                {/* Main calibration strip area */}
                <div 
                  className="absolute border-2 border-green-400 border-dashed"
                  style={{ 
                    top: `${strip.roi.y * 100}%`, 
                    left: `${strip.roi.x * 100}%`, 
                    width: `${strip.roi.width * 100}%`, 
                    height: `${strip.roi.height * 100}%` 
                  }}
                >
                  <div className="absolute -top-5 left-0 text-green-400 bg-gray-900 bg-opacity-70 px-1 text-xs rounded">
                    {strip.name} Cal
                  </div>
                </div>
                
                {/* Individual calibration segments */}
                {strip.concentrations.map((conc, segIndex) => (
                  <div
                    key={`overlay-segment-${strip.name}-${segIndex}`}
                    className="absolute border border-green-300 border-opacity-50"
                    style={{
                      top: `${(strip.roi.y + (segIndex * strip.roi.height / 5)) * 100}%`,
                      left: `${strip.roi.x * 100}%`,
                      width: `${strip.roi.width * 100}%`,
                      height: `${(strip.roi.height / 5) * 100}%`
                    }}
                  >
                    <div className="absolute -top-3 left-0 text-green-300 text-xs bg-gray-900 bg-opacity-70 px-1 rounded">
                      {conc}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            {/* Test areas */}
            {PESTICIDE_ROIS.map(({name, roi}) => (
              <div 
                key={`overlay-test-${name}`}
                className="absolute border-2 border-cyan-400 border-dashed"
                style={{ 
                  top: `${roi.y * 100}%`, 
                  left: `${roi.x * 100}%`, 
                  width: `${roi.width * 100}%`, 
                  height: `${roi.height * 100}%` 
                }}
              >
                <div className="absolute -top-5 left-0 text-cyan-400 bg-gray-900 bg-opacity-70 px-1 text-xs rounded">
                  {name} Test
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Info */}
      {imageDimensions.width > 0 && (
        <div className="w-full max-w-2xl bg-gray-800 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-300">
            Image size: {imageDimensions.width} × {imageDimensions.height} pixels
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">Adjustment Controls</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Zoom Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zoom: {zoom.toFixed(2)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Rotation Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rotation: {rotation}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <AppButton onClick={handleReset} variant="secondary" className="w-full">
                Reset
              </AppButton>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <AppButton onClick={onBack} variant="secondary" className="flex-1">
            Back
          </AppButton>
          <AppButton onClick={handleConfirm} className="flex-1">
            Confirm & Analyze
          </AppButton>
        </div>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-2xl bg-blue-900 border border-blue-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-200 mb-2">Instructions</h3>
        <ul className="text-blue-100 text-sm space-y-1">
          <li>• <strong>Drag</strong> the image to position it correctly</li>
          <li>• <strong>Zoom</strong> in/out to match the analysis frame size</li>
          <li>• <strong>Rotate</strong> if needed to align with the frame</li>
          <li>• Ensure the <span className="text-green-400">green calibration strips</span> and <span className="text-cyan-400">cyan test areas</span> align with your kit</li>
          <li>• Click "Confirm & Analyze" when satisfied with the alignment</li>
          <li>• <strong>Note:</strong> The full image will be preserved - no cropping will occur</li>
        </ul>
      </div>
    </div>
  );
}; 