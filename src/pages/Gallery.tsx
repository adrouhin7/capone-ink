import React, { useEffect, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import GalleryGrid from '@/components/GalleryGrid';
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage.from('gallery-images').list('', {
          limit: 100, // Adjust as needed
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

        if (error) {
          throw error;
        }

        const fetchedImages: GalleryImage[] = data.map((file) => ({
          id: file.id,
          name: file.name,
          url: supabase.storage.from('gallery-images').getPublicUrl(file.name).data.publicUrl,
        }));
        setImages(fetchedImages);
      } catch (error: any) {
        showError(`Erreur lors du chargement des images de la galerie : ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="bg-capone-black min-h-screen flex items-center justify-center text-capone-white text-xl py-16">
        Chargement de la galerie...
      </div>
    );
  }

  return (
    <div className="bg-capone-black min-h-screen text-capone-white py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Notre Galerie</SectionTitle>
        <p className="text-center text-lg md:text-xl text-capone-white mb-12 max-w-3xl mx-auto">
          Découvrez un aperçu de nos réalisations. Chaque pièce est unique et reflète la personnalité de nos clients.
        </p>
        {images.length === 0 ? (
          <p className="text-center text-capone-white text-lg">Aucune image à afficher pour le moment. L'administrateur peut en ajouter via le panneau d'administration.</p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </div>
  );
};

export default Gallery;