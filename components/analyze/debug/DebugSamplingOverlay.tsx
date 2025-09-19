import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Switch, FormControlLabel, IconButton, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import type { SamplingResult } from '../../../utils/imageProcessing/pixelSampling';

interface DebugSamplingOverlayProps {
  samplingResults: SamplingResult[];
  manualClickResult: SamplingResult | null;
  showDebug: boolean;
  isPixelPickerMode: boolean;
  onToggleDebug: (show: boolean) => void;
  onTogglePixelPicker: (enabled: boolean) => void;
  imageWidth: number;
  imageHeight: number;
}

export const DebugSamplingOverlay: React.FC<DebugSamplingOverlayProps> = ({
  samplingResults,
  manualClickResult,
  showDebug,
  isPixelPickerMode,
  onToggleDebug,
  onTogglePixelPicker,
  imageWidth,
  imageHeight
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

  return (
    <>
      {/* Debug Controls - Always visible */}
      <Box 
        position="absolute" 
        top={10} 
        right={10} 
        zIndex={1000} 
        display="flex" 
        flexDirection="column" 
        gap={1}
        sx={{ pointerEvents: 'auto' }}
      >
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
        {showDebug && (
          <FormControlLabel
            control={
              <Switch
                checked={isPixelPickerMode}
                onChange={(e) => onTogglePixelPicker(e.target.checked)}
                size="small"
                color="secondary"
              />
            }
            label="Pixel Picker"
            sx={{ color: 'white', '& .MuiFormControlLabel-label': { fontSize: '0.8rem' } }}
          />
        )}
      </Box>

      {/* Manual Click Overlay - Show clicked area */}
      {showDebug && isPixelPickerMode && manualClickResult && (
        <Box
          position="absolute"
          left={manualClickResult.samplingArea.x * imageWidth}
          top={manualClickResult.samplingArea.y * imageHeight}
          width={manualClickResult.samplingArea.width * imageWidth}
          height={manualClickResult.samplingArea.height * imageHeight}
          border="3px solid #ff6b6b"
          sx={{ 
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            pointerEvents: 'none'
          }}
          zIndex={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            sx={{
              color: '#ff6b6b',
              fontWeight: 'bold',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem'
            }}
          >
            🎯 Manual Click ({manualClickResult.validPixels} pixels)
          </Typography>
        </Box>
      )}

      {/* Sampling Area Overlays - Only show when debug is enabled */}
      {showDebug && samplingResults.map((result) => {
        const overlayX = result.samplingArea.x * imageWidth;
        const overlayY = result.samplingArea.y * imageHeight;
        const overlayWidth = result.samplingArea.width * imageWidth;
        const overlayHeight = result.samplingArea.height * imageHeight;
        

        // Use different colors based on sampling success
        const borderColor = result.validPixels > 0 ? '#4fc3f7' : '#ff6b6b';
        const backgroundColor = result.validPixels > 0 ? 'rgba(79, 195, 247, 0.1)' : 'rgba(255, 107, 107, 0.2)';
        const textColor = result.validPixels > 0 ? '#4fc3f7' : '#ff6b6b';

        return (
          <Box key={result.pesticide}>
            {/* ROI Border */}
            <Box
              position="absolute"
              left={overlayX}
              top={overlayY}
              width={overlayWidth}
              height={overlayHeight}
              border={`1px solid ${borderColor}`}
              sx={{ 
                backgroundColor: 'transparent',
                pointerEvents: 'none'
              }}
              zIndex={2}
            />
            
            {/* Label positioned outside the ROI */}
            <Box
              position="absolute"
              left={overlayX + overlayWidth + 5}
              top={overlayY}
              zIndex={2}
              sx={{ pointerEvents: 'none' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: textColor,
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: '1px 3px',
                  borderRadius: '2px',
                  fontSize: '0.6rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {result.pesticide} {result.validPixels === 0 ? '⚠️' : `(${result.validPixels})`}
              </Typography>
            </Box>
          </Box>
        );
      })}

      {/* Debug Data Panel - Only show when debug is enabled */}
      {showDebug && (
      <Box
        position="absolute"
        top={80}
        right={10}
        width="350px"
        maxHeight="70vh"
        overflow="auto"
        zIndex={1000}
        sx={{ pointerEvents: 'auto' }}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: 1.5,
            maxHeight: '100%',
            overflow: 'auto',
            fontSize: '0.8rem'
          }}
        >
          {/* Panel Header with Collapse Button */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle1" sx={{ color: '#4fc3f7', fontSize: '1rem' }}>
              Debug Panel
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              sx={{ color: 'white', padding: '2px' }}
            >
              {isPanelExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={isPanelExpanded}>
          {isPixelPickerMode && (
            <Typography variant="caption" sx={{ color: '#ff6b6b', mb: 1, fontWeight: 'bold', display: 'block' }}>
              🎯 Click on image to analyze pixels
            </Typography>
          )}
          
          {/* Manual Click Result */}
          {manualClickResult && (
            <Box key="manual-click" mb={3}>
              <Typography variant="subtitle1" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                🎯 Manual Click Result
              </Typography>
              
              <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
                <Chip 
                  label={`Click: (${manualClickResult.centerPoint.x.toFixed(2)}, ${manualClickResult.centerPoint.y.toFixed(2)})`}
                  size="small"
                  sx={{ backgroundColor: '#ff6b6b', color: 'white', fontSize: '0.7rem', height: '20px' }}
                />
                <Chip 
                  label={`Bright: ${manualClickResult.averageBrightness.toFixed(2)}`}
                  size="small"
                  sx={{ backgroundColor: '#9c27b0', color: 'white', fontSize: '0.7rem', height: '20px' }}
                />
                <Chip 
                  label={`Pixels: ${manualClickResult.validPixels}`}
                  size="small"
                  sx={{ backgroundColor: '#4caf50', color: 'white', fontSize: '0.7rem', height: '20px' }}
                />
              </Box>

              <Box ml={1}>
                {manualClickResult.pixels.length > 0 ? (
                  manualClickResult.pixels.slice(0, 5).map((pixel, pixelIndex) => {
                    // Use pre-calculated brightness instead of recalculating
                    const colorBonus = (pixel.g * 0.3) + (pixel.b * 0.2);
                    const priority = pixel.brightness + colorBonus;
                    const isTopPixel = pixelIndex === 0;
                    return (
                      <Box key={pixelIndex} mb={0.3}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isTopPixel ? '#ff6b6b' : '#e0e0e0',
                            fontWeight: isTopPixel ? 'bold' : 'normal',
                            fontSize: '0.7rem',
                            lineHeight: 1.2
                          }}
                        >
                          {isTopPixel ? '🏆 ' : ''}#{pixelIndex + 1}: RGB({pixel.r},{pixel.g},{pixel.b}) B:{pixel.brightness.toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="caption" sx={{ color: '#ff6b6b', fontSize: '0.7rem' }}>
                    No valid pixels found
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* NEW: Coordinate-Based Detection Results */}
          {samplingResults.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ color: '#4fc3f7', fontWeight: 'bold', mb: 1 }}>
                🎯 Coordinate-Based Detection Results
              </Typography>
              
              {samplingResults.map((result) => {
                const pixel = result.pixels[0]; // Get the single pixel from coordinate sampling
                const coordinate = result.centerPoint;
                return (
                  <Box key={result.pesticide} mb={2} sx={{ 
                    border: '1px solid #4fc3f7', 
                    borderRadius: 1, 
                    p: 1, 
                    backgroundColor: 'rgba(79, 195, 247, 0.1)' 
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#4fc3f7', fontWeight: 'bold', mb: 0.5 }}>
                      {result.pesticide}
                    </Typography>
                    
                    <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
                      <Chip 
                        label={`Coord: (${coordinate.x.toFixed(0)}, ${coordinate.y.toFixed(0)})`}
                        size="small"
                        sx={{ backgroundColor: '#4fc3f7', color: 'white', fontSize: '0.7rem', height: '20px' }}
                      />
                      <Chip 
                        label={`RGB: (${pixel?.r || 0}, ${pixel?.g || 0}, ${pixel?.b || 0})`}
                        size="small"
                        sx={{ backgroundColor: '#ff9800', color: 'white', fontSize: '0.7rem', height: '20px' }}
                      />
                      <Chip 
                        label={`Brightness: ${result.averageBrightness.toFixed(2)}`}
                        size="small"
                        sx={{ backgroundColor: '#9c27b0', color: 'white', fontSize: '0.7rem', height: '20px' }}
                      />
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: '#e0e0e0', fontSize: '0.7rem', display: 'block' }}>
                      Direct pixel sampling at absolute coordinates
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Automatic Sampling Results */}
          {samplingResults.map((result) => (
            <Box key={result.pesticide} mb={2}>
              <Typography variant="subtitle1" sx={{ color: '#81c784', fontWeight: 'bold' }}>
                {result.pesticide}
              </Typography>
              
              <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
                <Chip 
                  label={`Bright: ${result.averageBrightness.toFixed(2)}`}
                  size="small"
                  sx={{ backgroundColor: '#9c27b0', color: 'white', fontSize: '0.7rem', height: '20px' }}
                />
                <Chip 
                  label={`Pixels: ${result.validPixels}`}
                  size="small"
                  sx={{ backgroundColor: '#4caf50', color: 'white', fontSize: '0.7rem', height: '20px' }}
                />
                <Chip 
                  label={`Method: ${result.samplingMethod}`}
                  size="small"
                  sx={{ backgroundColor: '#2196f3', color: 'white', fontSize: '0.7rem', height: '20px' }}
                />
                {(result.pesticide === 'Acephate' || result.pesticide === 'Atrazine') && (
                  <Chip 
                    label="Edge"
                    size="small"
                    sx={{ backgroundColor: '#ff5722', color: 'white', fontSize: '0.7rem', height: '20px' }}
                  />
                )}
              </Box>

              <Box ml={1}>
                {result.errorMessage && (
                  <Typography variant="caption" sx={{ color: '#ff6b6b', display: 'block', mb: 1, fontWeight: 'bold', fontSize: '0.7rem' }}>
                    ⚠️ {result.errorMessage}
                  </Typography>
                )}
                
                {result.pixels.length > 0 ? (
                  result.pixels.slice(0, 3).map((pixel, pixelIndex) => {
                    // Use pre-calculated brightness instead of recalculating
                    const colorBonus = (pixel.g * 0.3) + (pixel.b * 0.2);
                    const priority = pixel.brightness + colorBonus;
                    const isTopPixel = pixelIndex === 0;
                    return (
                      <Box key={pixelIndex} mb={0.3}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isTopPixel ? '#4fc3f7' : '#e0e0e0',
                            fontWeight: isTopPixel ? 'bold' : 'normal',
                            fontSize: '0.7rem',
                            lineHeight: 1.2
                          }}
                        >
                          {isTopPixel ? '🏆 ' : ''}#{pixelIndex + 1}: RGB({pixel.r},{pixel.g},{pixel.b}) B:{pixel.brightness.toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="caption" sx={{ color: '#ff6b6b', fontSize: '0.7rem' }}>
                    No valid pixels found
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
          </Collapse>
        </Paper>
      </Box>
      )}
    </>
  );
};
