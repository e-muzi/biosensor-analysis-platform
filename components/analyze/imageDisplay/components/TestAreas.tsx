import { Box } from '@mui/material';
import { PESTICIDE_ROIS } from '../../../../utils/constants/roiConstants';

interface TestAreasProps {
  dotPositions?: Array<{ name: string; x: number; y: number }>;
  imageDimensions?: { width: number; height: number } | null;
}

export const TestAreas = ({ dotPositions, imageDimensions }: TestAreasProps) => {
  // Use dynamic dot positions if available, otherwise fallback to default ROIs
  const testAreas = dotPositions && dotPositions.length > 0 
    ? dotPositions.map(dot => {
        // Find the corresponding default ROI to get the width and height
        const defaultROI = PESTICIDE_ROIS.find(roi => roi.name === dot.name);
        
        // Convert pixel coordinates to percentage coordinates
        const width = imageDimensions?.width || 400;
        const height = imageDimensions?.height || 300;
        
        // Calculate box dimensions
        const boxWidth = defaultROI?.roi.width || 0.08;
        const boxHeight = defaultROI?.roi.height || 0.1;
        
        // Convert dot position to percentage and center the box around it
        const dotX = dot.x / width;
        const dotY = dot.y / height;
        
        return {
          name: dot.name,
          roi: {
            x: Math.max(0, Math.min(1 - boxWidth, dotX - boxWidth / 2)), // Center the box horizontally around the dot, clamp to image bounds
            y: Math.max(0, Math.min(1 - boxHeight, dotY - boxHeight / 2)), // Center the box vertically around the dot, clamp to image bounds
            width: boxWidth,
            height: boxHeight,
          }
        };
      })
    : PESTICIDE_ROIS;

  return (
    <>
      {testAreas.map(({ name, roi }) => (
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
