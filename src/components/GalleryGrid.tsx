import React from 'react';
import { cn } from '@/lib/utils';

interface GalleryGridProps {
  images: { id: string; name: string; url: string }[];
  className?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, className }) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4",
      className
    )}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl shadow-lg group transform transition-transform duration-300 hover:scale-105"
        >
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-72 object-cover transition-opacity duration-300 group-hover:opacity-80 select-none pointer-events-none"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;