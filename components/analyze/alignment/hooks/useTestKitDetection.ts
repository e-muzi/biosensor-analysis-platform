import { useCallback } from "react";
import { detectTestKitBoundariesAdvanced } from "../../../../utils/analysis";

// Test Kit Detection
export function useTestKitDetection(
  imageRef: React.RefObject<HTMLImageElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setCropBounds: (bounds: { x: number; y: number; width: number; height: number } | null) => void,
  setIsAutoDetecting: (detecting: boolean) => void
) {
  const autoDetectTestKit = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current) return;
    setIsAutoDetecting(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;
      ctx.drawImage(imageRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const bounds = detectTestKitBoundariesAdvanced(imageData);
      if (bounds) {
        setCropBounds(bounds);
      } else {
        const fallbackWidth = Math.floor(canvas.width * 0.8);
        const fallbackHeight = Math.floor(canvas.height * 0.8);
        const fallbackX = Math.floor((canvas.width - fallbackWidth) / 2);
        const fallbackY = Math.floor((canvas.height - fallbackHeight) / 2);
        setCropBounds({ x: fallbackX, y: fallbackY, width: fallbackWidth, height: fallbackHeight });
      }
    } catch (error) {
      console.error("Auto-detection failed:", error);
      if (imageRef.current && canvasRef.current) {
        const fallbackWidth = Math.floor(imageRef.current.naturalWidth * 0.8);
        const fallbackHeight = Math.floor(imageRef.current.naturalHeight * 0.8);
        const fallbackX = Math.floor((imageRef.current.naturalWidth - fallbackWidth) / 2);
        const fallbackY = Math.floor((imageRef.current.naturalHeight - fallbackHeight) / 2);
        setCropBounds({ x: fallbackX, y: fallbackY, width: fallbackWidth, height: fallbackHeight });
      }
    } finally {
      setIsAutoDetecting(false);
    }
  }, [imageRef, canvasRef, setCropBounds, setIsAutoDetecting]);

  return {
    autoDetectTestKit
  };
}
