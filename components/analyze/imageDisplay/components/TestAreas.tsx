import { Box } from '@mui/material';
import { PESTICIDE_ROIS, PESTICIDE_ROIS_CAPTURE_MODE } from '../../../../utils/constants/roiConstants';

interface TestAreasProps {
  showCaptureModePositions?: boolean;
}

export const TestAreas = ({ showCaptureModePositions = false }: TestAreasProps) => {
  const rois = showCaptureModePositions ? PESTICIDE_ROIS_CAPTURE_MODE : PESTICIDE_ROIS;
  
  // Log which test areas are being used
  if (showCaptureModePositions) {
    console.log('🟢 TestAreas: Showing CAMERA CAPTURE green boxes (moved down, dots centered)');
    console.log('📍 Capture mode test areas:', PESTICIDE_ROIS_CAPTURE_MODE);
  } else {
    console.log('🟢 TestAreas: Showing UPLOAD/NORMAL green boxes');
    console.log('📍 Normal test areas:', PESTICIDE_ROIS);
  }
  
  return (
    <>
      {rois.map(({ name, roi }) => (
        <Box
          key={name}
          sx={{
            position: 'absolute',
            left: `${roi.x * 100}%`,
            top: `${roi.y * 100}%`,
            width: `${roi.width * 100}%`,
            height: `${roi.height * 100}%`,
            border: '1px solid',
            borderColor: 'primary.main',
            backgroundColor: 'transparent',
            pointerEvents: 'none',
            borderRadius: 1,
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
};
