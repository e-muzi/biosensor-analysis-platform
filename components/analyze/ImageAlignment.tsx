import React, { useCallback } from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { AppButton } from '../shared';
import { AlignmentHeader } from './alignment/Header';
import { CanvasStage } from './alignment/CanvasStage';
import { CropOverlay } from './alignment/CropOverlay';
import { AlignmentControls } from './alignment/Controls';
import { useAlignmentCanvas } from './alignment/useAlignmentCanvas';

// This component allows users to align and crop the test kit area from an uploaded image
interface ImageAlignmentProps {
  imageSrc: string;
  onConfirm: (alignedImageSrc: string) => void;
  onBack: () => void;
}

export const ImageAlignment: React.FC<ImageAlignmentProps> = ({ imageSrc, onConfirm, onBack }) => {
  const { getColors } = useThemeStore();
  const colors = getColors();

  const {
    canvasRef,
    imageRef,
    containerRef,
    imageDisplaySize,
    imageLoaded,
    cropBounds,
    isAutoDetecting,
    isDragging,
    isPanning,
    scale,
    rotation,
    handleImageLoad,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
    handleConfirmCrop,
    handleAutoCrop,
  } = useAlignmentCanvas(imageSrc);


  const onConfirmCrop = useCallback(async () => {
    const dataUrl = await handleConfirmCrop();
    if (dataUrl) onConfirm(dataUrl);
  }, [handleConfirmCrop, onConfirm]);

  const onAutoCrop = useCallback(async () => {
    const dataUrl = await handleAutoCrop();
    if (dataUrl) onConfirm(dataUrl);
  }, [handleAutoCrop, onConfirm]);


  return (
    <div 
      className="p-4 md:p-6 max-w-4xl mx-auto flex flex-col items-center space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      <AlignmentHeader 
        title="Align & Crop Test Kit"
        subtitle="Adjust the highlighted area to precisely crop your test kit"
        textColor={colors.text}
        subtitleColor={colors.textSecondary}
      />
      
      <div ref={containerRef} className="w-full max-w-2xl">
        <div 
          className="relative border-2 rounded-lg overflow-hidden"
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <CanvasStage 
            canvasRef={canvasRef}
            imageDisplaySize={imageDisplaySize}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          
          {/* Hidden image for reference */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Test kit"
            className="hidden"
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
          
          {/* Crop overlay */}
          {cropBounds && imageLoaded && canvasRef.current && (
            <CropOverlay 
              cropBounds={cropBounds}
              canvasWidth={canvasRef.current.width}
              canvasHeight={canvasRef.current.height}
              primaryColor={iGEMColors.primary}
              surfaceColor={colors.surface}
              borderColor={colors.border}
            />
          )}
          
          {/* Loading indicator */}
          {isAutoDetecting && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <div className="text-center">
                <div 
                  className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                  style={{ borderColor: iGEMColors.primary }}
                ></div>
                <p style={{ color: 'white' }}>Detecting test kit...</p>
              </div>
            </div>
          )}
        </div>
        
        <AlignmentControls 
          scale={scale}
          rotation={rotation}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onReset={handleResetTransform}
          colors={{ background: colors.surface, text: colors.text, border: colors.border }}
          accentColor={iGEMColors.accent}
        />

        <div 
          className="mt-2 text-center text-sm"
          style={{ color: colors.textSecondary }}
        >
          {isDragging
            ? 'Drag to move the selection'
            : isPanning
              ? 'Drag to pan the image beneath the selection'
              : 'Drag inside the selection to move it, or drag elsewhere to pan the image'}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <AppButton onClick={onBack} variant="outline" className="flex-1">
          ← Back
        </AppButton>
        <AppButton 
          onClick={onAutoCrop} 
          disabled={!imageLoaded}
          variant="secondary"
          className="flex-1"
        >
          🔄 Auto-Crop
        </AppButton>
        <AppButton 
          onClick={onConfirmCrop} 
          disabled={!cropBounds || !imageLoaded}
          className="flex-1"
        >
          ✅ Confirm Crop
        </AppButton>
      </div>
      
      <div 
        className="text-center text-sm max-w-md p-4 rounded-lg"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          color: colors.textSecondary
        }}
      >
        <p className="mb-2">
          <strong style={{ color: colors.text }}>Manual Alignment:</strong> Drag the highlighted area to precisely crop the test kit.
        </p>
        <p>
          <strong style={{ color: colors.text }}>Auto-Crop:</strong> Use the improved detection algorithm to automatically crop the test kit area.
        </p>
      </div>
    </div>
  );
}; 