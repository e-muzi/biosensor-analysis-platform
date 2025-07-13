import React, { useRef } from 'react';
import { AppButton } from '../shared';

interface ImageUploadProps {
  onImageSelect: (imageSrc: string) => void;
  onOpenCamera: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onOpenCamera }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      <div className="flex space-x-4">
        <AppButton onClick={() => fileInputRef.current?.click()} variant="secondary">
          Upload Image
        </AppButton>
        <AppButton onClick={onOpenCamera}>
          Use Camera
        </AppButton>
      </div>
    </>
  );
}; 