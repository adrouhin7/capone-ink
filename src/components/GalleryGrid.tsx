import React from 'react';
import { cn } from '@/lib/utils';

interface GalleryGridProps {
  images: { src: string; alt: string }[];
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
            src={image.src}
            alt={image.alt}
            className="w-full h-72 object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
          <div className="absolute inset-0 bg-capone-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-capone-white text-lg font-semibold text-center p-4">{image.alt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;