import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn("ink-title text-3xl md:text-4xl font-bold text-center text-capone-white mb-8 relative pb-2", className)}>
      {children}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-capone-red rounded-full"></span>
    </h2>
  );
};

export default SectionTitle;