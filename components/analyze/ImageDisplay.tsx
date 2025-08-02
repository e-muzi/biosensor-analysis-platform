import { forwardRef } from 'react';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
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
      <div 
        className="relative w-full max-w-md aspect-square rounded-md overflow-hidden mb-4 flex items-center justify-center border-2 border-dashed"
        style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }}
      >
        {imageSrc ? (
          <>
            <img ref={ref} src={imageSrc} alt="Sample" className="w-full h-full object-contain" />
            {showROIs && (
              <>
                {/* Show calibration strips */}
                {CALIBRATION_STRIPS.map((strip) => (
                  <div key={`strip-${strip.name}`}>
                    {/* Main calibration strip area */}
                    <div 
                      className="absolute border-2 border-green-400 border-dashed pointer-events-none"
                      style={{ 
                        top: `${strip.roi.y * 100}%`, 
                        left: `${strip.roi.x * 100}%`, 
                        width: `${strip.roi.width * 100}%`, 
                        height: `${strip.roi.height * 100}%` 
                      }}
                    >
                      <div 
                        className="absolute -top-5 left-0 text-green-400 px-1 text-xs rounded"
                        style={{ 
                          backgroundColor: colors.surface,
                          opacity: 0.9
                        }}
                      >
                        {strip.name} Cal
                      </div>
                    </div>
                    
                    {/* Show individual calibration segments (vertical) */}
                    {strip.concentrations.map((conc, segIndex) => (
                      <div
                        key={`segment-${strip.name}-${segIndex}`}
                        className="absolute border border-green-300 border-opacity-50 pointer-events-none"
                        style={{
                          top: `${(strip.roi.y + (segIndex * strip.roi.height / 5)) * 100}%`,
                          left: `${strip.roi.x * 100}%`,
                          width: `${strip.roi.width * 100}%`,
                          height: `${(strip.roi.height / 5) * 100}%`
                        }}
                      >
                        <div 
                          className="absolute -top-3 left-0 text-green-300 text-xs px-1 rounded"
                          style={{ 
                            backgroundColor: colors.surface,
                            opacity: 0.9
                          }}
                        >
                          {conc}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                {/* Show test areas */}
                {PESTICIDE_ROIS.map(({name, roi}) => (
                  <div 
                    key={`test-${name}`}
                    className="absolute border-2 border-cyan-400 border-dashed pointer-events-none"
                    style={{ 
                      top: `${roi.y * 100}%`, 
                      left: `${roi.x * 100}%`, 
                      width: `${roi.width * 100}%`, 
                      height: `${roi.height * 100}%` 
                    }}
                  >
                    <div 
                      className="absolute -top-5 left-0 text-cyan-400 px-1 text-xs rounded"
                      style={{ 
                        backgroundColor: colors.surface,
                        opacity: 0.9
                      }}
                    >
                      {name} Test
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <div 
            className="text-center px-4"
            style={{ color: colors.textSecondary }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-2">Upload or capture an image of the kit</p>
            <p 
              className="text-xs mt-1"
              style={{ color: colors.textSecondary }}
            >
              Green: Calibration strips | Cyan: Test areas
            </p>
          </div>
        )}
      </div>
    );
  }
); 