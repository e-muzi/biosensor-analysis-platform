# Team HK-Joint-School 2025 Software Tool

A sophisticated biosensor analysis application designed for the iGEM 2025 competition. This tool enables quantitative pesticide concentration analysis through image processing of biosensor test kits, featuring built-in calibration strips for accurate measurements without external normalization.

## Description

This application is a React-based web tool that analyzes biosensor test kits to detect and quantify pesticide concentrations in samples. The tool uses computer vision techniques to analyze the brightness of test areas and compares them against calibration strips with known concentrations.

### Key Features

- **Multi-Pesticide Detection**: Supports analysis of four common pesticides:
  - Acephate (0-100 µM range)
  - Glyphosate (0-200 µM range)
  - Mancozeb (0-120 µM range)
  - Cypermethrin (0-180 µM range)

- **Built-in Calibration**: Each test kit includes vertical calibration strips with 5 known concentration points, eliminating the need for external calibration

- **Image Processing**: Advanced image analysis using RGB luminance calculations for accurate brightness measurements

- **Real-time Analysis**: Instant results with confidence levels (high/medium/low) based on calibration strip matching

- **Data Management**: Comprehensive history tracking and data export capabilities

- **Cross-platform**: Web-based application accessible on any device with a camera

### Technical Architecture

- **Frontend**: React 19 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Zustand for lightweight, efficient state handling
- **Image Processing**: Custom algorithms for ROI detection and brightness analysis
- **UI Components**: Modular component architecture with responsive design

## Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/e-muzi/biosensor-apptesting.git
   cd biosensor-apptesting
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

### Test Kit Preparation

1. Ensure your biosensor test kit has the correct layout:
   - Four pesticide test areas arranged horizontally
   - Each test area has a vertical calibration strip on the left
   - Calibration strips contain 5 segments with known concentrations (top to bottom: lowest to highest)

### Analysis Process

1. **Capture/Upload Image**
   - Navigate to the 'Capture' tab
   - Use your device's camera to take a photo of the test kit
   - Alternatively, upload an existing image file
   - The app will automatically crop to the test kit area

2. **Image Alignment** (if needed)
   - Adjust the image alignment to ensure proper ROI detection
   - Green boxes indicate calibration strip segments
   - Cyan boxes indicate test areas

3. **Analysis**
   - The app automatically analyzes both calibration strips and test areas
   - Brightness values are calculated using RGB luminance formula
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

We welcome contributions to improve the biosensor analysis tool! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the existing code style
4. Test your changes thoroughly
5. Submit a pull request with a clear description of your changes

### Code Style

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Maintain consistent formatting with the existing codebase
- Add appropriate comments for complex algorithms

### Testing

- Test image processing with various test kit layouts
- Verify calibration accuracy across different lighting conditions
- Ensure responsive design works on different screen sizes

## Authors and Acknowledgments

### Development Team

- **Team HK-Joint-School 2025** - iGEM Competition Entry
- **CPU Students** - Primary development and algorithm design

### Technologies Used

- **React** - Frontend framework
- **TypeScript** - Type safety and development experience
- **Vite** - Build tool and development server
- **Zustand** - State management
- **Canvas API** - Image processing and analysis

### Acknowledgments

- **iGEM Foundation** - For providing the platform for synthetic biology innovation
- **Open Source Community** - For the excellent tools and libraries that made this project possible
- **Academic Advisors** - For guidance on biosensor technology and pesticide detection methods

### Live Application

The application is available online at: https://hkjs-biosensorapp.netlify.app/

---

_This project was developed for the iGEM 2025 competition, focusing on innovative solutions for environmental monitoring and pesticide detection using synthetic biology approaches._
