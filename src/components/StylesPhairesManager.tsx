import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { v4 as uuidv4 } from 'uuid';

interface TattooStyle {
  id: string;
  title: string;
  imageUrl: string;
}

const StylesPhairesManager: React.FC = () => {
  const [styles, setStyles] = useState<TattooStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);

  // Fetch styles on mount
  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    setLoading(true);
    try {
      // Default styles if not in database
      const defaultStyles = [
        { id: 'realiste', title: 'Réaliste', imageUrl: '/placeholder.svg' },
        { id: 'old-school', title: 'Old School', imageUrl: '/placeholder.svg' },
        { id: 'fineline', title: 'Fineline', imageUrl: '/placeholder.svg' },
      ];

      // Try to fetch from storage (styles-phares folder)
      const { data: files, error } = await supabase.storage
        .from('Photo shop')
        .list('styles-phares', { limit: 100 });

      if (error) {
        console.error('Error fetching styles:', error);
        setStyles(defaultStyles);
        return;
      }

      // Map stored files to styles
      const fetchedStyles = defaultStyles.map((style) => {
        const fileForStyle = files?.find((f) => f.name.startsWith(style.id));
        if (fileForStyle) {
          const url = supabase.storage
            .from('Photo shop')
            .getPublicUrl(`styles-phares/${fileForStyle.name}`).data.publicUrl;
          return { ...style, imageUrl: url };
        }
        return style;
      });

      setStyles(fetchedStyles);
    } catch (error: any) {
      console.error('Error:', error);
      showError(`Erreur lors du chargement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadStyle = async (styleId: string) => {
    if (!selectedFile) {
      showError('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);
    const toastId = showLoading('Upload en cours...');

    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `styles-phares/${styleId}.${fileExtension}`;

      // Delete old file if exists
      const oldFileName = `styles-phares/${styleId}.*`;
      const { data: existingFiles } = await supabase.storage
        .from('Photo shop')
        .list('styles-phares');

      const oldFile = existingFiles?.find((f) => f.name.startsWith(styleId));
      if (oldFile) {
        await supabase.storage
          .from('Photo shop')
          .remove([`styles-phares/${oldFile.name}`]);
      }

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from('Photo shop')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      showSuccess('Image du style mise à jour !');
      setSelectedFile(null);
      setSelectedStyleId(null);
      fetchStyles();
    } catch (error: any) {
      showError(`Erreur d'upload: ${error.message}`);
    } finally {
      dismissToast(toastId);
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-capone-white">Chargement des styles...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-capone-grey rounded-xl shadow-xl">
      <h3 className="text-2xl font-bold text-capone-red text-center">Gérer les Styles Phares</h3>

      <div className="space-y-6">
        {styles.map((style) => (
          <div
            key={style.id}
            className="p-4 bg-capone-black rounded-lg border border-capone-grey"
          >
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-capone-red mb-2">{style.title}</h4>
                <div className="mb-4">
                  <img
                    src={style.imageUrl}
                    alt={style.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {selectedStyleId === style.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`file-${style.id}`} className="text-capone-white">
                        Sélectionner une nouvelle image
                      </Label>
                      <Input
                        id={`file-${style.id}`}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red mt-2"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUploadStyle(style.id)}
                        disabled={!selectedFile || uploading}
                        className="bg-capone-red hover:bg-capone-red-hover text-capone-white flex-1"
                      >
                        {uploading ? 'Upload...' : 'Confirmer'}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedStyleId(null);
                          setSelectedFile(null);
                        }}
                        variant="outline"
                        className="bg-capone-black border-capone-grey text-capone-white hover:bg-capone-grey flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setSelectedStyleId(style.id)}
                    className="w-full bg-capone-red hover:bg-capone-red-hover text-capone-white"
                  >
                    Modifier l'image
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StylesPhairesManager;
