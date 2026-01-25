import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Trash2, Edit2 } from 'lucide-react';

interface BarberImage {
  id: string;
  name: string;
  url: string;
}

interface BarberGalleryManagerProps {
  refreshTrigger?: number;
}

const BarberGalleryManager: React.FC<BarberGalleryManagerProps> = ({ refreshTrigger = 0 }) => {
  const [images, setImages] = useState<BarberImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null);
  const [replacing, setReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('Photo shop')
        .list('barber-images', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) {
        console.error('❌ Bucket access error:', error);
        throw new Error(`Impossible d'accéder au bucket: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ Aucune image de barber trouvée');
        setImages([]);
        return;
      }

      const fetchedImages: BarberImage[] = data
        .filter((file) => !file.name.startsWith('.'))
        .map((file) => {
          const url = supabase.storage.from('Photo shop').getPublicUrl(`barber-images/${file.name}`).data.publicUrl;
          return {
            id: file.id,
            name: file.name,
            url: url,
          };
        });

      setImages(fetchedImages);
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      showError(`Erreur lors du chargement des images : ${error.message}`);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      const timer = setTimeout(() => {
        fetchImages();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger, fetchImages]);

  const handleDeleteImage = async (imageName: string) => {
    const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer cette image ?`);
    if (!confirmDelete) return;

    const toastId = showLoading('Suppression en cours...');
    try {
      const { error } = await supabase.storage
        .from('Photo shop')
        .remove([`barber-images/${imageName}`]);

      if (error) {
        throw error;
      }

      dismissToast(toastId);
      showSuccess('Image supprimée avec succès !');
      setImages(images.filter((img) => img.name !== imageName));
    } catch (error: any) {
      dismissToast(toastId);
      showError(`Erreur lors de la suppression : ${error.message}`);
    }
  };

  const handleModifyClick = (imagePath: string) => {
    setSelectedImagePath(imagePath);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Si selectedImagePath est défini, c'est un remplacement
    if (selectedImagePath) {
      setReplacing(true);
      const toastId = showLoading('Remplacement en cours...');

      try {
        const fileExtension = file.name.split('.').pop();
        const newFileName = `${selectedImagePath.split('.')[0]}.${fileExtension}`;

        // Supprimer l'ancienne image
        await supabase.storage
          .from('Photo shop')
          .remove([`barber-images/${selectedImagePath}`]);

        // Attendre un peu avant d'uploader la nouvelle
        await new Promise(resolve => setTimeout(resolve, 500));

        // Uploader la nouvelle image
        const { error: uploadError } = await supabase.storage
          .from('Photo shop')
          .upload(`barber-images/${newFileName}`, file, {
            cacheControl: '0',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        dismissToast(toastId);
        showSuccess('Image remplacée avec succès !');

        // Attendre avant de rafraîchir
        await new Promise(resolve => setTimeout(resolve, 500));
        fetchImages();
        setSelectedImagePath(null);
      } catch (error: any) {
        dismissToast(toastId);
        showError(`Erreur lors du remplacement : ${error.message}`);
      } finally {
        setReplacing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } else {
      // C'est un ajout de nouvelle image
      const toastId = showLoading('Upload en cours...');

      try {
        const fileName = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('Photo shop')
          .upload(`barber-images/${fileName}`, file, {
            cacheControl: '0',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        dismissToast(toastId);
        showSuccess('Image ajoutée avec succès !');

        // Attendre avant de rafraîchir
        await new Promise(resolve => setTimeout(resolve, 500));
        fetchImages();
      } catch (error: any) {
        dismissToast(toastId);
        showError(`Erreur lors de l'upload : ${error.message}`);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-capone-grey rounded-lg p-8 text-center text-capone-white">
        Chargement des images du barber...
      </div>
    );
  }

  return (
    <div className="mt-12 p-8 bg-capone-grey rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-capone-red">Galerie Barber gang</h2>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={replacing}
          className="bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-2 px-6 rounded-full transition-all"
        >
          + Ajouter une image
        </Button>
      </div>

      {images.length === 0 ? (
        <p className="text-capone-white text-center py-8">
          Aucune image de barber pour le moment. Ajoutez-en via le bouton ci-dessus.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.name} className="relative bg-capone-black rounded-lg overflow-hidden group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-75 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleModifyClick(image.name)}
                  disabled={replacing}
                  className="bg-capone-red hover:bg-capone-red-hover text-capone-white p-2 rounded-full transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteImage(image.name)}
                  disabled={replacing}
                  className="bg-red-600 hover:bg-red-700 text-capone-white p-2 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default BarberGalleryManager;
