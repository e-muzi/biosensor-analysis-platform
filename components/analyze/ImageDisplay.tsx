import { forwardRef } from 'react';
import { Box } from '@mui/material';
import { EmptyState } from './imageDisplay/components/EmptyState';
import { CalibrationStrips } from './imageDisplay/components/CalibrationStrips';
import { TestAreas } from './imageDisplay/components/TestAreas';
import { useModeStore } from '../../state/modeStore';
import { PESTICIDE_CENTER_POINTS, PESTICIDE_CENTER_POINTS_CAPTURE_MODE } from '../../utils/constants/roiConstants';

interface ImageDisplayProps {
  imageSrc: string | null;
  showROIs?: boolean;
  showCaptureModePositions?: boolean; // Show analysis positions instead of capture positions
}

export const ImageDisplay = forwardRef<HTMLImageElement, ImageDisplayProps>(
  ({ imageSrc, showROIs = true, showCaptureModePositions = false }, ref) => {
    const { detectionMode } = useModeStore();

    const handleImageLoad = () => {
    };

    // Log which positions are being used
    if (showCaptureModePositions) {
      console.log('🎯 ImageDisplay: Showing CAMERA CAPTURE analysis positions (dots centered in moved boxes)');
      console.log('📍 Camera capture analysis positions:', PESTICIDE_CENTER_POINTS_CAPTURE_MODE);
    } else {
      console.log('🎯 ImageDisplay: Showing UPLOAD/NORMAL positions');
      console.log('📍 Upload/Normal positions:', PESTICIDE_CENTER_POINTS);
    }

    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 'md',
          aspectRatio: '1/1',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 2,
          borderStyle: 'dashed',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        {imageSrc ? (
          <>
            <Box
              component='img'
              ref={ref}
              src={imageSrc}
              alt='Sample'
              onLoad={handleImageLoad}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                cursor: 'default',
                position: 'relative',
                zIndex: 0,
                pointerEvents: 'auto',
              }}
            />
            {showROIs && (
              <>
                {detectionMode === 'strip' && <CalibrationStrips />}
                <TestAreas showCaptureModePositions={showCaptureModePositions} />

                {/* Guide dots overlay - show analysis positions if from capture mode */}
                {(showCaptureModePositions ? PESTICIDE_CENTER_POINTS_CAPTURE_MODE : PESTICIDE_CENTER_POINTS).map((pesticide: any) => (
                  <Box key={pesticide.name}>
                    {/* Guide dot positioned at the center of the green box */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${pesticide.roi.x * 100}%`,
                        top: `${pesticide.roi.y * 100}%`,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'red',
                        border: '2px solid white',
                        zIndex: 15, // Higher than green boxes
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 8px rgba(255, 0, 0, 0.8)',
                      }}
                    />

                    {/* Pesticide label */}
                    <Box
                      component='span'
                      sx={{
                        position: 'absolute',
                        left: `${pesticide.roi.x * 100}%`,
                        top: `${pesticide.roi.y * 100}%`,
                        transform: 'translate(-50%, -120%)',
                        color: 'red',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        px: 0.5,
                        py: 0.2,
                        borderRadius: 0.5,
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        zIndex: 15,
                        border: '1px solid red',
                      }}
                    >
                      {pesticide.name}
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </Box>
    );
  }
);
