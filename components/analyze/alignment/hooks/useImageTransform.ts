import { useState, useCallback } from 'react';

// Image Transform
export function useImageTransform() {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageTransform, setImageTransform] = useState({ x: 0, y: 0 });

  const handleZoomIn = useCallback(
    () => setScale(prev => Math.min(prev * 1.2, 3)),
    []
  );
  const handleZoomOut = useCallback(
    () => setScale(prev => Math.max(prev / 1.2, 0.5)),
    []
  );
  const handleRotateLeft = useCallback(
    () => setRotation(prev => prev - 90),
    []
  );
  const handleRotateRight = useCallback(
    () => setRotation(prev => prev + 90),
    []
  );
  const handleResetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setImageTransform({ x: 0, y: 0 });
  }, []);

  return {
    scale,
    rotation,
    imageTransform,
    setImageTransform,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
    handleResetTransform,
  };
}
