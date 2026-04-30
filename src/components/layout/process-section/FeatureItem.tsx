import React from 'react';

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureItem = ({ title, description, icon }: FeatureItemProps) => {
  return (
    // items-start and text-left ensure the icon and text are always on the left
    <div className="flex flex-col mb-12 w-full items-start text-left">
      
      {/* Row 1: Icon (Left Aligned) */}
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/10 text-cyan-600 mb-4 shadow-sm border border-cyan-500/20">
        {icon}
      </div>

      {/* Row 2: Name */}
      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-2">
        {title}
      </h3>
      
      {/* Row 3: Content */}
      <p className="text-gray-500 text-sm leading-relaxed max-w-[300px]">
        {description}
      </p>
      
    </div>
  );
};
