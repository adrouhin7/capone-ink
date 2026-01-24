import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Trash2, Edit2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
}

interface AdminGalleryManagerProps {
  refreshTrigger?: number;
}

const AdminGalleryManager: React.FC<AdminGalleryManagerProps> = ({ refreshTrigger = 0 }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(null);
  const [replacing, setReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      console.log('=== DIAGNOSTIC COMPLET ===');
      
      // Get current session to use authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session?.user?.id || 'anonymous');
      
      // Try listing with different parameters
      const { data, error } = await supabase.storage
        .from('Photo shop')
        .list('', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      console.log('Listing result:', { dataLength: data?.length, error });

      if (error) {
        console.error('❌ Bucket access error:', error);
        throw new Error(`Impossible d'accéder au bucket: ${error.message}`);
      }

      // Check if data is empty but accessible
      if (!data || data.length === 0) {
        console.warn('⚠️ Bucket is accessible but appears empty');
        console.log('This might be a permissions issue. Check RLS policies in Supabase.');
        setImages([]);
        showError('Le bucket est accessible mais semble vide. Vérifiez les permissions RLS dans Supabase.');
        return;
      }

      console.log('✅ Images récupérées:', data);
      console.log('Total images:', data.length);

      // Filtrer les fichiers spécialisés (exclure les dossiers artist-photo, hero-background, styles-phares)
      const excludedFolders = ['artist-photo', 'hero-background', 'styles-phares'];
      const visibleFiles = data.filter((file) =>
        !excludedFolders.includes(file.name)
      );

      console.log('Images après filtrage:', visibleFiles.length);

      const fetchedImages: GalleryImage[] = visibleFiles
        .filter((file) => !file.name.startsWith('.'))
        .map((file) => {
          const url = supabase.storage.from('Photo shop').getPublicUrl(file.name).data.publicUrl;
          console.log(`📸 Fichier: ${file.name} -> URL: ${url}`);
          return {
            id: file.id,
            name: file.name,
            url: url,
          };
        });

      console.log('✅ Images mappées:', fetchedImages);
      setImages(fetchedImages);
    } catch (error: any) {
      console.error('❌ Erreur complète:', error);
      showError(`Erreur lors du chargement des images : ${error.message}`);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Refresh when refreshTrigger changes (from Admin.tsx)
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('Refresh triggered, waiting 1 second for Supabase indexing...');
      const timer = setTimeout(() => {
        console.log('Fetching images after delay...');
        fetchImages();
      }, 1000); // Wait 1 second for Supabase to index the file
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger, fetchImages]);

  const handleDeleteImage = async (imageName: string) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
    if (!confirmDelete) return;

    const toastId = showLoading('Suppression en cours...');
    try {
      const { error } = await supabase.storage.from('Photo shop').remove([imageName]);

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

  const handleModifyClick = (imagePath: string) => {
    setSelectedImagePath(imagePath);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile || !selectedImagePath) return;

    const toastId = showLoading('Remplacement en cours...');
    setReplacing(true);

    try {
      // Delete the old image
      const { error: deleteError } = await supabase.storage
        .from('Photo shop')
        .remove([selectedImagePath]);

      if (deleteError) {
        throw new Error(`Erreur de suppression : ${deleteError.message}`);
      }

      // Upload the new image with the same path
      const { error: uploadError } = await supabase.storage
        .from('Photo shop')
        .upload(selectedImagePath, newFile, {
          cacheControl: '0',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Erreur d'upload : ${uploadError.message}`);
      }

      showSuccess('Image remplacée avec succès !');
      setSelectedImagePath(null);
      fetchImages(); // Refresh the list
    } catch (error: any) {
      showError(error.message || `Erreur lors du remplacement : ${error.message}`);
    } finally {
      dismissToast(toastId);
      setReplacing(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
              <div className="absolute inset-0 bg-capone-black bg-opacity-60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-capone-red hover:bg-capone-red-hover rounded-full h-12 w-12"
                  onClick={() => handleModifyClick(image.name)}
                  disabled={replacing}
                >
                  <Edit2 className="h-6 w-6" />
                  <span className="sr-only">Modifier l'image</span>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="bg-red-700 hover:bg-red-800 rounded-full h-12 w-12"
                  onClick={() => handleDeleteImage(image.name)}
                  disabled={replacing}
                >
                  <Trash2 className="h-6 w-6" />
                  <span className="sr-only">Supprimer l'image</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Hidden file input for image replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AdminGalleryManager;