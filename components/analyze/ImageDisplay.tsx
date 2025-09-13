import { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { useThemeStore } from '../../state/themeStore';
import { PESTICIDE_ROIS, CALIBRATION_STRIPS } from '../../utils/analysis';

interface ImageDisplayProps {
  imageSrc: string | null;
  showROIs?: boolean;
}

export const ImageDisplay = forwardRef<HTMLImageElement, ImageDisplayProps>(
  ({ imageSrc, showROIs = true }, ref) => {
    const { getColors } = useThemeStore();
    const colors = getColors();

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
          backgroundColor: 'background.paper'
        }}
      >
        {imageSrc ? (
          <>
            <Box
              component="img"
              ref={ref}
              src={imageSrc}
              alt="Sample"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            {showROIs && (
              <>
                {/* Show calibration strips */}
                {CALIBRATION_STRIPS.map((strip) => (
                  <Box key={`strip-${strip.name}`}>
                    {/* Main calibration strip area */}
                    <Box
                      sx={{
                        position: 'absolute',
                        border: 2,
                        borderColor: 'green.400',
                        borderStyle: 'dashed',
                        pointerEvents: 'none',
                        top: `${strip.roi.y * 100}%`,
                        left: `${strip.roi.x * 100}%`,
                        width: `${strip.roi.width * 100}%`,
                        height: `${strip.roi.height * 100}%`
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          color: 'green.400',
                          px: 0.5,
                          backgroundColor: 'background.paper',
                          opacity: 0.9,
                          borderRadius: 0.5
                        }}
                      >
                        {strip.name} Cal
                      </Typography>
                    </Box>
                    
                    {/* Show individual calibration segments (vertical) */}
                    {strip.concentrations.map((conc, segIndex) => (
                      <Box
                        key={`segment-${strip.name}-${segIndex}`}
                        sx={{
                          position: 'absolute',
                          border: 1,
                          borderColor: 'green.300',
                          opacity: 0.5,
                          pointerEvents: 'none',
                          top: `${(strip.roi.y + (segIndex * strip.roi.height / 5)) * 100}%`,
                          left: `${strip.roi.x * 100}%`,
                          width: `${strip.roi.width * 100}%`,
                          height: `${(strip.roi.height / 5) * 100}%`
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            top: -12,
                            left: 0,
                            color: 'green.300',
                            px: 0.5,
                            backgroundColor: 'background.paper',
                            opacity: 0.9,
                            borderRadius: 0.5,
                            fontSize: '0.75rem'
                          }}
                        >
                          {conc}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
                
                {/* Show test areas */}
                {PESTICIDE_ROIS.map(({name, roi}) => (
                  <Box
                    key={`test-${name}`}
                    sx={{
                      position: 'absolute',
                      border: 2,
                      borderColor: 'cyan.400',
                      borderStyle: 'dashed',
                      pointerEvents: 'none',
                      top: `${roi.y * 100}%`,
                      left: `${roi.x * 100}%`,
                      width: `${roi.width * 100}%`,
                      height: `${roi.height * 100}%`
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: 0,
                        color: 'cyan.400',
                        px: 0.5,
                        backgroundColor: 'background.paper',
                        opacity: 0.9,
                        borderRadius: 0.5
                      }}
                    >
                      {name} Test
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              px: 2,
              color: 'text.secondary'
            }}
          >
            <CameraAltIcon sx={{ fontSize: 48, mx: 'auto', display: 'block', mb: 1 }} />
            <Typography variant="body2">
              Upload or capture an image of the kit
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
);
