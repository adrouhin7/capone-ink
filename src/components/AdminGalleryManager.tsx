import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Trash2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
}

const AdminGalleryManager: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('gallery-images').list('', {
        limit: 100,
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
      showError(`Erreur lors du chargement des images : ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDeleteImage = async (imageName: string) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
    if (!confirmDelete) return;

    const toastId = showLoading('Suppression en cours...');
    try {
      const { error } = await supabase.storage.from('gallery-images').remove([imageName]);

      if (error) {
        throw error;
      }

      showSuccess('Image supprimée avec succès !');
      fetchImages(); // Refresh the list
    } catch (error: any) {
      showError(`Erreur de suppression : ${error.message}`);
    } finally {
      dismissToast(toastId);
    }
  };

  if (loading) {
    return <div className="text-center text-capone-white text-xl">Chargement des images...</div>;
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-capone-red text-center">Images de la galerie</h3>
      {images.length === 0 ? (
        <p className="text-center text-capone-white text-lg">Aucune image dans la galerie pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="relative bg-capone-black rounded-xl shadow-lg overflow-hidden group">
              <img src={image.url} alt={image.name} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-capone-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="destructive"
                  size="icon"
                  className="bg-red-700 hover:bg-red-800 rounded-full h-12 w-12"
                  onClick={() => handleDeleteImage(image.name)}
                >
                  <Trash2 className="h-6 w-6" />
                  <span className="sr-only">Supprimer l'image</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManager;