import React from 'react';
import { Box, Typography, Paper, Chip, Switch, FormControlLabel } from '@mui/material';
import type { SamplingResult } from '../../../utils/imageProcessing/pixelSampling';

interface DebugSamplingOverlayProps {
  samplingResults: SamplingResult[];
  showDebug: boolean;
  onToggleDebug: (show: boolean) => void;
  imageWidth: number;
  imageHeight: number;
}

export const DebugSamplingOverlay: React.FC<DebugSamplingOverlayProps> = ({
  samplingResults,
  showDebug,
  onToggleDebug,
  imageWidth,
  imageHeight
}) => {
  console.log('Debug: DebugSamplingOverlay render', { showDebug, samplingResults: samplingResults.length, imageWidth, imageHeight });

  return (
    <>
      {/* Debug Toggle - Always visible */}
      <Box position="absolute" top={10} right={10} zIndex={1000}>
        <FormControlLabel
          control={
            <Switch
              checked={showDebug}
              onChange={(e) => onToggleDebug(e.target.checked)}
              size="small"
            />
          }
          label="Debug"
          sx={{ color: 'white', '& .MuiFormControlLabel-label': { fontSize: '0.8rem' } }}
        />
      </Box>

      {/* Sampling Area Overlays - Only show when debug is enabled */}
      {showDebug && samplingResults.map((result) => {
        const overlayX = result.samplingArea.x * imageWidth;
        const overlayY = result.samplingArea.y * imageHeight;
        const overlayWidth = result.samplingArea.width * imageWidth;
        const overlayHeight = result.samplingArea.height * imageHeight;
        
        console.log('Debug: Rendering overlay for', result.pesticide, { overlayX, overlayY, overlayWidth, overlayHeight });

        // Use different colors based on sampling success
        const borderColor = result.validPixels > 0 ? '#4fc3f7' : '#ff6b6b';
        const backgroundColor = result.validPixels > 0 ? 'rgba(79, 195, 247, 0.1)' : 'rgba(255, 107, 107, 0.2)';
        const textColor = result.validPixels > 0 ? '#4fc3f7' : '#ff6b6b';

        return (
          <Box
            key={result.pesticide}
            position="absolute"
            left={overlayX}
            top={overlayY}
            width={overlayWidth}
            height={overlayHeight}
            border={`2px solid ${borderColor}`}
            sx={{ backgroundColor }}
            zIndex={999}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="caption"
              sx={{
                color: textColor,
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '2px 4px',
                borderRadius: '2px',
                fontSize: '0.7rem'
              }}
            >
              {result.pesticide} {result.validPixels === 0 ? '⚠️' : `(${result.validPixels})`}
            </Typography>
          </Box>
        );
      })}

      {/* Debug Data Panel - Only show when debug is enabled */}
      {showDebug && (
      <Box
        position="absolute"
        bottom={10}
        left={10}
        right={10}
        maxHeight="40vh"
        overflow="auto"
        zIndex={1000}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: 2,
            maxHeight: '100%',
            overflow: 'auto'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#4fc3f7' }}>
            Debug: Priority-Based Sampling (Brightness + Color Bonus)
          </Typography>
          
          {samplingResults.map((result) => (
            <Box key={result.pesticide} mb={2}>
              <Typography variant="subtitle1" sx={{ color: '#81c784', fontWeight: 'bold' }}>
                {result.pesticide}
              </Typography>
              
              <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                <Chip 
                  label={`Center: (${result.centerPoint.x.toFixed(3)}, ${result.centerPoint.y.toFixed(3)})`}
                  size="small"
                  sx={{ backgroundColor: '#ff9800', color: 'white' }}
                />
                <Chip 
                  label={`Avg Brightness: ${result.averageBrightness.toFixed(1)}`}
                  size="small"
                  sx={{ backgroundColor: '#9c27b0', color: 'white' }}
                />
                <Chip 
                  label={`Valid: ${result.validPixels}/${result.totalPixels}`}
                  size="small"
                  sx={{ backgroundColor: '#4caf50', color: 'white' }}
                />
                <Chip 
                  label={`Invalid Filtered: ${result.invalidPixelsFiltered}`}
                  size="small"
                  sx={{ backgroundColor: '#f44336', color: 'white' }}
                />
                <Chip 
                  label={`Method: ${result.samplingMethod}`}
                  size="small"
                  sx={{ backgroundColor: '#2196f3', color: 'white' }}
                />
                {(result.pesticide === 'Acephate' || result.pesticide === 'Atrazine') && (
                  <Chip 
                    label="Edge Pesticide"
                    size="small"
                    sx={{ backgroundColor: '#ff5722', color: 'white' }}
                  />
                )}
              </Box>

              <Box ml={2}>
                <Typography variant="caption" sx={{ color: '#b0bec5', display: 'block', mb: 1 }}>
                  Sampling Area: ({result.samplingArea.x.toFixed(3)}, {result.samplingArea.y.toFixed(3)}) 
                  {result.samplingArea.width.toFixed(3)} × {result.samplingArea.height.toFixed(3)}
                </Typography>
                
                {result.errorMessage && (
                  <Typography variant="caption" sx={{ color: '#ff6b6b', display: 'block', mb: 1, fontWeight: 'bold' }}>
                    ⚠️ Error: {result.errorMessage}
                  </Typography>
                )}
                
                {result.pixels.length > 0 ? (
                  result.pixels.map((pixel, pixelIndex) => {
                    // Calculate priority score for display using improved formula
                    const brightness = (0.299 * pixel.r) + (0.587 * pixel.g) + (0.114 * pixel.b);
                    const colorBonus = (pixel.g * 0.3) + (pixel.b * 0.2);
                    const priority = brightness + colorBonus;
                    const isTopPixel = pixelIndex === 0;
                    return (
                      <Box key={pixelIndex} mb={0.5}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isTopPixel ? '#4fc3f7' : '#e0e0e0',
                            fontWeight: isTopPixel ? 'bold' : 'normal'
                          }}
                        >
                          {isTopPixel ? '🏆 ' : ''}#{pixelIndex + 1}: ({pixel.x}, {pixel.y}) | 
                          RGB({pixel.r}, {pixel.g}, {pixel.b}) | 
                          Priority: {priority.toFixed(1)} | 
                          Brightness: {pixel.brightness.toFixed(1)}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="caption" sx={{ color: '#ff6b6b' }}>
                    No valid pixels found
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
      )}
    </>
  );
};
