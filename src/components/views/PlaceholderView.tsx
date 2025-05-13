import type { ReactNode } from 'react';
import React from 'react';

interface PlaceholderViewProps {
  label: string;
  icon: ReactNode;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ label, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground opacity-50">
      <div className="mb-4">{icon}</div>
      <p className="text-base"><span className='text-primary'>{label}</span> content goes here.</p>
    </div>
  );
};
