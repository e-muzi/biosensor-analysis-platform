import React from 'react';

interface AlignmentHeaderProps {
  title: string;
  subtitle: string;
  textColor: string;
  subtitleColor: string;
}

export const AlignmentHeader: React.FC<AlignmentHeaderProps> = ({
  title,
  subtitle,
  textColor,
  subtitleColor,
}) => {
  return (
    <div className="text-center">
      <h2 
        className="text-3xl font-bold mb-2"
        style={{ color: textColor }}
      >
        {title}
      </h2>
      <p 
        className="text-sm"
        style={{ color: subtitleColor }}
      >
        {subtitle}
      </p>
    </div>
  );
};

