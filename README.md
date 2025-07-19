# HK-Joint-School - iGEM 2025

Biosensor analysis app (2rd version) by CPU student to quantify pesticide concentration by analyzing the brightness of a sample image of our biosensor. The app uses calibration strips on each test kit to provide accurate concentration measurements without normalization. Users can capture photos, analyze samples using built-in calibration strips, and view historical data.

## Tech Stack

*   **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)

## Ready to start? 

! Follow these instructions to set up and run the project locally !

### Prerequisites (IMPORTANT)

Make sure you have [Node.js](https://nodejs.org/en/) installed!!!

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/e-muzi/biosensor-apptesting.git
    cd biosensor-apptesting
    ```

2.  **Install dependencies:**
    This command will install all the necessary packages defined in `package.json`~ 
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (the port may be different, check your terminal output!!!)

## How to Use?

1.  **Prepare Test Kit**: Ensure your biosensor test kit has calibration strips on the left side of each pesticide test area. Each calibration strip contains 5 segments with known concentrations (0, 25, 50, 75, 100 µM for Acephate; 0, 50, 100, 150, 200 µM for Glyphosate; etc.).

2.  **Capture/Upload**: Navigate to the 'Capture' screen to either take a photo with your device's camera (automatically crops to test kit area) or upload an existing image file of your test kit.

3.  **Analyze**: After uploading, the app will automatically analyze both the calibration strips and test areas. The green boxes show calibration strip segments, and cyan boxes show test areas.

4.  **View Results**: The app will display the calculated concentration for each pesticide with confidence levels (high/medium/low) based on how well the test brightness matches the calibration strip.

5.  **Check History**: Go to 'History' to see a list of all your past analyses. You may clear all history data in the 'Settings' function.

## New Features in Version 3

- **Calibration Strips**: Each pesticide test area now has its own calibration strip with 5 known concentration points
- **No Normalization Required**: Direct comparison between test areas and calibration strips eliminates the need for white reference normalization
- **Confidence Levels**: Results include confidence indicators based on how well the test brightness matches calibration points
- **Improved Accuracy**: More accurate concentration measurements using real-time calibration data

## Test Kit Layout

The test kit has the following layout (left to right):
- **Acephate**: Vertical calibration strip (0-100 µM, top to bottom) + Test area
- **Glyphosate**: Vertical calibration strip (0-200 µM, top to bottom) + Test area  
- **Mancozeb**: Vertical calibration strip (0-120 µM, top to bottom) + Test area
- **Cypermethrin**: Vertical calibration strip (0-180 µM, top to bottom) + Test area

Each calibration strip is a vertical rectangle divided into 5 small squares with known concentrations arranged from top (lowest) to bottom (highest).
