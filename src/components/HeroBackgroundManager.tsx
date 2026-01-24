import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { v4 as uuidv4 } from 'uuid';

const HeroBackgroundManager: React.FC = () => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('/hero-background.jpg');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchHeroBackground();
  }, []);

  const fetchHeroBackground = async () => {
    setLoading(true);
    try {
      // Try to fetch hero background from storage
      const { data: files, error } = await supabase.storage
        .from('Photo shop')
        .list('hero-background', { limit: 10 });

      if (error || !files || files.length === 0) {
        console.log('Using default hero background');
        setBackgroundUrl('/hero-background.jpg');
        setLoading(false);
        return;
      }

      // Get the most recent hero background
      const heroFile = files[0];
      const url = supabase.storage
        .from('Photo shop')
        .getPublicUrl(`hero-background/${heroFile.name}`).data.publicUrl;

      setBackgroundUrl(url);
    } catch (error: any) {
      console.error('Error fetching hero background:', error);
      setBackgroundUrl('/hero-background.jpg');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadBackground = async () => {
    if (!selectedFile) {
      showError('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);
    const toastId = showLoading('Upload en cours...');

    try {
      // Delete all old hero backgrounds
      const { data: existingFiles } = await supabase.storage
        .from('Photo shop')
        .list('hero-background');

      if (existingFiles && existingFiles.length > 0) {
        await Promise.all(
          existingFiles.map((f) =>
            supabase.storage
              .from('Photo shop')
              .remove([`hero-background/${f.name}`])
          )
        );
      }

      // Upload new hero background
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `hero-background/hero-${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('Photo shop')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      showSuccess('Image de fond mise à jour !');
      setSelectedFile(null);
      setShowUploadForm(false);
      
      // Refresh the background
      setTimeout(() => {
        fetchHeroBackground();
      }, 500);
    } catch (error: any) {
      showError(`Erreur d'upload: ${error.message}`);
    } finally {
      dismissToast(toastId);
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-capone-white">Chargement...</div>;
  }

  return (
    <div className="space-y-4 p-6 bg-capone-grey rounded-xl shadow-xl">
      <h3 className="text-2xl font-bold text-capone-red text-center">Gérer l'Image de Fond (Hero)</h3>

      <div className="mb-4">
        <img
          src={backgroundUrl}
          alt="Hero Background Preview"
          className="w-full h-64 object-cover rounded-lg border border-capone-red"
        />
      </div>

      {!showUploadForm ? (
        <Button
          onClick={() => setShowUploadForm(true)}
          className="w-full bg-capone-red hover:bg-capone-red-hover text-capone-white"
        >
          Changer l'image de fond
        </Button>
      ) : (
        <div className="space-y-3 p-4 bg-capone-black rounded-lg border border-capone-grey">
          <div>
            <Label htmlFor="hero-file" className="text-capone-white">
              Sélectionner une nouvelle image
            </Label>
            <Input
              id="hero-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red mt-2"
            />
            <p className="text-sm text-capone-white mt-2">
              💡 Recommandé: 1920x1080px ou plus pour une meilleure qualité
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUploadBackground}
              disabled={!selectedFile || uploading}
              className="bg-capone-red hover:bg-capone-red-hover text-capone-white flex-1"
            >
              {uploading ? 'Upload...' : 'Confirmer'}
            </Button>
            <Button
              onClick={() => {
                setShowUploadForm(false);
                setSelectedFile(null);
              }}
              variant="outline"
              className="bg-capone-black border-capone-grey text-capone-white hover:bg-capone-grey flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBackgroundManager;
