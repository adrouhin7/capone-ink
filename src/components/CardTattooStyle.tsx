import React from 'react';
import { cn } from '@/lib/utils';

interface CardTattooStyleProps {
  title: string;
  description: string;
  imageUrl: string;
  className?: string;
}

const CardTattooStyle: React.FC<CardTattooStyleProps> = ({ title, description, imageUrl, className }) => {
  return (
    <div className={cn(
      "bg-capone-grey rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105",
      className
    )}>
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-64 object-cover select-none pointer-events-none"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-capone-red mb-3">{title}</h3>
        <p className="text-capone-white text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default CardTattooStyle;