import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import GalleryGrid from '@/components/GalleryGrid';

const placeholderImages = [
  { src: '/placeholder.svg', alt: 'Tatouage Réaliste' },
  { src: '/placeholder.svg', alt: 'Tatouage Old School' },
  { src: '/placeholder.svg', alt: 'Tatouage Fineline' },
  { src: '/placeholder.svg', alt: 'Tatouage Graphique' },
  { src: '/placeholder.svg', alt: 'Tatouage Traditionnel' },
  { src: '/placeholder.svg', alt: 'Tatouage Floral' },
  { src: '/placeholder.svg', alt: 'Tatouage Animalier' },
  { src: '/placeholder.svg', alt: 'Tatouage Géométrique' },
];

const Gallery: React.FC = () => {
  return (
    <div className="bg-capone-black min-h-screen text-capone-white py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Notre Galerie</SectionTitle>
        <p className="text-center text-lg md:text-xl text-capone-white mb-12 max-w-3xl mx-auto">
          Découvrez un aperçu de nos réalisations. Chaque pièce est unique et reflète la personnalité de nos clients.
        </p>
        <GalleryGrid images={placeholderImages} />
      </div>
    </div>
  );
};

export default Gallery;