# Team HK-Joint-School 2025 Software Tool

A sophisticated biosensor analysis application designed for the iGEM 2025 competition. This tool enables quantitative pesticide concentration analysis through image processing of biosensor test kits, featuring built-in calibration strips for accurate measurements without external normalization.

**Current Version**: 0.0.1
**Status**: Active Development  
**Live Demo**: [https://hkjs-biosensorapp.netlify.app/](https://hkjs-biosensorapp.netlify.app/)

## Description

This application is a React-based web app that analyzes biosensor test kits to detect and quantify pesticide concentrations in samples. The tool uses Computer Vision techniques to analyze the brightness of test areas and compares them against calibration strips with known concentrations.

### Key Features

- **Multi-Pesticide Detection**: Supports analysis of five common pesticides with pesticide-specific concentration thresholds:
  - **Acephate**: Low (0.01-0.1 mg/L), Medium (0.1-0.5 mg/L), High (0.5-1.0 mg/L)
  - **Glyphosate**: Low (0.1-0.3 mg/L), Medium (0.3-0.7 mg/L), High (0.7-1.0 mg/L)
  - **Malathion**: Low (0.1-0.4 mg/L), Medium (0.4-0.8 mg/L), High (0.8-1.0 mg/L)
  - **Chlorpyrifos**: Low (0.01-0.05 mg/L), Medium (0.05-0.1 mg/L), High (0.1-1.0 mg/L)
  - **Acetamiprid**: Low (0.01-0.1 mg/L), Medium (0.1-0.5 mg/L), High (0.5-1.0 mg/L)

- **Dual Detection Modes**: 
  - **Preset Standard Curve Mode** (Default): Uses predefined calibration curves for rapid analysis with standardized concentration ranges
  - **Strip Mode**: Analyzes built-in calibration strips for flexible, kit-specific measurements

- **Image Processing**: Image analysis using RGB calculations for accurate measurements
- **Enhanced ROI Detection**: Precise region-of-interest (ROI) detection with pixel-level coordinate sampling
- **Interactive Alignment**: Canvas-based image alignment tools for optimal analysis positioning

- **Real-time Analysis**: Instant results with confidence levels (high/medium/low) based on standard curve matching

- **Data Management**: Comprehensive history tracking and data export capabilities

- **Cross-platform**: Web-based application accessible on any device with a camera

### Recent Updates

- **Dual Detection Modes**: Introduced preset standard curve mode (default) and strip mode for flexible analysis approaches
- **Enhanced Pesticide Support**: Expanded from 4 to 5 pesticides with updated calibration curves
- **Improved Image Alignment**: Interactive canvas-based alignment tools for precise ROI positioning
- **Advanced Pixel Sampling**: Direct coordinate-based sampling for more accurate brightness measurements
- **Pesticide-Specific Thresholds**: Customized concentration thresholds for each pesticide in Preset mode, displayed in mg/L units
- **Material-UI Integration**: Modern UI framework with custom theming and responsive design

### Technical Architecture

- **Frontend**: React 19 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Zustand for lightweight, efficient state handling
- **Image Processing**: Custom algorithms for ROI detection and brightness analysis
- **UI Framework**: Material-UI (MUI) with custom theming and responsive design
- **Canvas Integration**: HTML5 Canvas API for interactive image manipulation and analysis

## Project Structure

The codebase is organized into logical modules for maintainability and scalability:

```
biosensor-apptesting-2/
├── App.tsx                          # Main application component and routing
├── index.tsx                        # Application entry point
├── types.ts                         # TypeScript type definitions
├── metadata.json                    # Application metadata
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
│
├── components/                      # React components organized by feature
│   ├── analyze/                     # Image analysis and capture functionality
│   │   ├── AnalysisResultScreen.tsx # Results display component
│   │   ├── CameraCapture.tsx        # Camera interface wrapper
│   │   ├── CaptureScreen.tsx        # Main capture interface
│   │   ├── ImageAlignment.tsx      # Image alignment tools
│   │   ├── ImageDisplay.tsx         # Image display with ROI overlays
│   │   ├── ImageUpload.tsx          # File upload component
│   │   ├── ResultCard.tsx           # Individual result display
│   │   │
│   │   ├── alignment/               # Image alignment functionality
│   │   │   ├── CanvasStage.tsx      # Main canvas component
│   │   │   ├── Controls.tsx         # Alignment control buttons
│   │   │   ├── CropOverlay.tsx      # Crop selection overlay
│   │   │   ├── Header.tsx           # Alignment screen header
│   │   │   ├── useAlignmentCanvas.ts # Main alignment logic hook
│   │   │   │
│   │   │   ├── components/         # Alignment sub-components
│   │   │   │   └── AlignmentCanvas.tsx
│   │   │   │
│   │   │   └── hooks/               # Alignment-specific hooks
│   │   │       ├── useCanvasState.ts    # Canvas state management
│   │   │       ├── useImageCropping.ts  # Image cropping logic
│   │   │       ├── useImageTransform.ts # Image transformation
│   │   │       ├── useMouseEvents.ts     # Mouse/touch event handling
│   │   │       └── useMovableDots.ts    # Movable dot controls
│   │   │
│   │   ├── camera/                  # Camera capture functionality
│   │   │   ├── components/           # Camera UI components
│   │   │   │   ├── CameraControls.tsx   # Camera control buttons
│   │   │   │   ├── CameraHeader.tsx     # Camera screen header
│   │   │   │   └── CameraView.tsx       # Camera video display
│   │   │   │
│   │   │   ├── hooks/               # Camera-specific hooks
│   │   │   │   ├── useCameraCapture.ts  # Main capture logic
│   │   │   │   ├── useCameraStream.ts   # Camera stream management
│   │   │   │   └── useImageCapture.ts   # Image capture processing
│   │   │   │
│   │   │   ├── overlays/            # Camera overlay components
│   │   │   │   ├── Overlays.tsx          # Main overlay container
│   │   │   │   └── components/
│   │   │   │       ├── CameraTestAreas.tsx    # Test area indicators
│   │   │   │       └── PesticideGuideDots.tsx # Guide dot overlays
│   │   │
│   │   ├── capture/                 # Image capture workflow
│   │   │   ├── components/           # Capture UI components
│   │   │   │   ├── CaptureActions.tsx    # Action buttons
│   │   │   │   ├── CaptureHeader.tsx     # Capture screen header
│   │   │   │   ├── ImageActions.tsx      # Image action buttons
│   │   │   │   └── ImagePreview.tsx      # Image preview display
│   │   │   │
│   │   │   └── hooks/                # Capture-specific hooks
│   │   │       └── useCaptureLogic.ts    # Main capture workflow
│   │   │
│   │   └── imageDisplay/            # Image display components
│   │       └── components/
│   │           ├── CalibrationStrips.tsx # Calibration strip display
│   │           ├── EmptyState.tsx         # Empty state component
│   │           └── TestAreas.tsx          # Test area indicators
│   │
│   ├── history/                     # Analysis history functionality
│   │   ├── HistoryItem.tsx          # Individual history item
│   │   ├── HistoryScreen.tsx       # History list screen
│   │   ├── components/              # History sub-components
│   │   │   ├── HistoryHeader.tsx       # History screen header
│   │   │   ├── HistoryName.tsx         # History item naming
│   │   │   └── HistoryResults.tsx      # History results display
│   │   └── hooks/                   # History-specific hooks
│   │       └── useHistoryItemLogic.ts  # History item logic
│   │
│   ├── settings/                    # Application settings
│   │   ├── SettingsScreen.tsx      # Main settings screen
│   │   ├── SettingsSection.tsx     # Settings section wrapper
│   │   ├── AboutSection.tsx        # About information
│   │   ├── CalibrationSettings.tsx # Calibration configuration
│   │   ├── DataSettings.tsx        # Data management settings
│   │   ├── DetectionModeSettings.tsx # Detection mode selection
│   │   │
│   │   ├── calibration/            # Calibration management
│   │   │   ├── components/         # Calibration UI components
│   │   │   │   ├── CalibrationEditActions.tsx # Edit controls
│   │   │   │   ├── CalibrationInputs.tsx     # Input fields
│   │   │   │   ├── PesticideActions.tsx      # Pesticide controls
│   │   │   │   ├── PesticideCard.tsx         # Pesticide display
│   │   │   │   └── PesticideName.tsx         # Pesticide naming
│   │   │   │
│   │   │   └── hooks/              # Calibration-specific hooks
│   │   │       └── useCalibrationLogic.ts   # Calibration logic
│   │
│   └── shared/                     # Shared components and utilities
│       ├── AppButton.tsx           # Reusable button component
│       ├── EmptyState.tsx         # Generic empty state
│       ├── Layout.tsx             # Main app layout
│       └── layout/                # Layout components
│           └── components/
│               ├── AppHeader.tsx       # Application header
│               ├── BottomNav.tsx       # Bottom navigation
│               └── MainContent.tsx     # Main content wrapper
│
├── state/                          # State management (Zustand stores)
│   ├── calibrationStore.ts         # Calibration data management
│   ├── historyStore.ts            # Analysis history storage
│   ├── modeStore.ts               # Detection mode state
│   ├── pesticideStore.ts          # Pesticide data management
│   ├── themeStore.ts              # Theme and UI state
│   ├── muiTheme.ts                # Material-UI theme configuration
│   └── themes/                    # Theme definitions
│       ├── darkTheme.ts           # Dark theme configuration
│       ├── lightTheme.ts          # Light theme configuration
│       └── palettes.ts            # Color palette definitions
│
├── utils/                          # Utility functions and algorithms
│   ├── analysis/                   # Analysis algorithms
│   │   ├── brightnessAnalysis.ts      # Brightness calculation methods
│   │   ├── brightnessCalculations.ts   # Brightness computation utilities
│   │   ├── calibrationAnalysis.ts     # Calibration curve analysis
│   │   ├── presetAnalysis.ts          # Preset curve analysis
│   │   └── unifiedAnalysis.ts         # Unified analysis interface
│   │
│   ├── constants/                 # Application constants
│   │   └── roiConstants.ts         # Region of Interest definitions
│   │
│   ├── imageProcessing/           # Image processing utilities
│   │   ├── brightness.ts              # Brightness calculation functions
│   │   ├── colorUtils.ts              # Color manipulation utilities
│   │   ├── imageCropping.ts           # Image cropping functions
│   │   ├── pixelSampling.ts           # Pixel sampling algorithms
│   │   ├── pixelValidation.ts          # Pixel validation logic
│   │   ├── samplingAlgorithms.ts      # Advanced sampling methods
│   │   ├── types.ts                   # Image processing types
│   │   └── index.ts                   # Processing utilities export
│   │
│   └── version.ts                 # Version management utilities
│
├── public/                         # Static assets
│   └── hkjs_logo.PNG              # Team logo
│
└── dist/                          # Production build output
    ├── assets/                     # Bundled assets
    ├── hkjs_logo.PNG              # Static assets
    └── index.html                  # Main HTML file
```

### Key Architectural Patterns

- **Feature-based Organization**: Components are grouped by functionality (analyze, history, settings)
- **Hook-based Logic**: Business logic is extracted into custom hooks for reusability
- **State Management**: Zustand stores manage different aspects of application state
- **Utility Separation**: Image processing and analysis algorithms are isolated in utils/
- **Component Composition**: Complex UI is built from smaller, focused components
- **Type Safety**: Comprehensive TypeScript types ensure code reliability

## Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/e-muzi/biosensor-apptesting-2.git
   cd biosensor-apptesting-2
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - The exact port will be shown in your terminal output

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory, ready for deployment.

## Usage

### Detection Modes

The application offers two analysis approaches to suit different needs:

#### **Preset Standard Curve Mode** (Default)
- Uses predefined calibration curves based on standardized concentration ranges
- Faster analysis with consistent results across different test kits
- Ideal for routine testing with known pesticide types
- Concentration ranges: Pesticide-specific thresholds in mg/L (see pesticide details above)

#### **Strip Mode** (Alternative)
- Analyzes the built-in calibration strips on each test kit
- Provides kit-specific measurements for maximum accuracy
- Flexible approach that adapts to individual test kit variations
- Recommended for research applications or when highest precision is required

**Mode Selection**: Choose your preferred detection mode in the Settings tab before analysis.

### Analysis Process

1. **Capture/Upload Image**
   - Navigate to the 'Capture' tab
   - Use your device's camera to take a photo of the test kit
   - Alternatively, upload an existing image file
   - The app will automatically crop to the test kit area

2. **Image Alignment** (if needed)
   - Adjust the image alignment to ensure proper ROI detection
   - Interactive canvas-based alignment tools for precise positioning
   - Green boxes indicate calibration strip segments
   - Cyan boxes indicate test areas
   - Manual adjustment controls for fine-tuning detection regions

3. **Analysis**
   - The app automatically analyzes based on your selected detection mode
   - **Preset Mode**: Uses predefined calibration curves for rapid analysis
   - **Strip Mode**: Analyzes built-in calibration strips for kit-specific measurements
   - Brightness values are calculated using total RGB
   - Concentrations are estimated by comparing test brightness to calibration curves

4. **Results Interpretation**
   - View calculated concentrations for each pesticide
   - Check confidence levels (high/medium/low) based on calibration matching
   - Save results to history for future reference

### Data Management

- **History**: Access all previous analyses in the 'History' tab
- **Settings**: Configure app preferences and clear historical data
- **Export**: Results can be saved locally for further analysis

## Contributing

We welcome contributions to improve the biosensor analysis platform! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the existing code style
4. Test your changes thoroughly
5. Submit a Pull Request with a clear description of your changes

### Code Style

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Maintain consistent formatting with the existing codebase
- Add appropriate comments for complex algorithms

### Testing

- Test image processing with various test kit layouts
- Verify calibration accuracy across different lighting conditions
- Ensure responsive design works on different screen sizes

### Technologies Used

- **React 19** - Frontend framework with latest features
- **TypeScript** - Type safety and development experience
- **Vite** - Build tool and development server
- **Zustand** - State management
- **Material-UI (MUI)** - UI component library with theming
- **Canvas API** - Image processing and analysis
- **React Easy Crop** - Image cropping functionality