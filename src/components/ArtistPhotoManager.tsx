import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

const ArtistPhotoManager: React.FC = () => {
  const [artistPhotoUrl, setArtistPhotoUrl] = useState<string>('/placeholder.svg');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchArtistPhoto();
  }, []);

  const fetchArtistPhoto = async () => {
    setLoading(true);
    try {
      // Try to fetch artist photo from storage
      const { data: files, error } = await supabase.storage
        .from('Photo shop')
        .list('artist-photo', { limit: 10 });

      if (error || !files || files.length === 0) {
        console.log('Using default artist photo');
        setArtistPhotoUrl('/placeholder.svg');
        setLoading(false);
        return;
      }

      // Get the artist photo
      const artistFile = files[0];
      const url = supabase.storage
        .from('Photo shop')
        .getPublicUrl(`artist-photo/${artistFile.name}`).data.publicUrl;

      setArtistPhotoUrl(url);
    } catch (error: any) {
      console.error('Error fetching artist photo:', error);
      setArtistPhotoUrl('/placeholder.svg');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      showError('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);
    const toastId = showLoading('Upload en cours...');

    try {
      // Delete all old artist photos
      const { data: existingFiles } = await supabase.storage
        .from('Photo shop')
        .list('artist-photo');

      if (existingFiles && existingFiles.length > 0) {
        await Promise.all(
          existingFiles.map((f) =>
            supabase.storage
              .from('Photo shop')
              .remove([`artist-photo/${f.name}`])
          )
        );
      }

      // Upload new artist photo
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `artist-photo/kewin-${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('Photo shop')
        .upload(fileName, selectedFile, {
          cacheControl: '0',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      showSuccess('Photo de l\'artiste mise à jour !');
      setSelectedFile(null);
      setShowUploadForm(false);

      // Refresh the photo
      setTimeout(() => {
        fetchArtistPhoto();
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
      <h3 className="text-2xl font-bold text-capone-red text-center">Gérer la Photo de l'Artiste</h3>

      <div className="mb-4">
        <img
          src={artistPhotoUrl}
          alt="Photo de l'artiste Kewin"
          className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-capone-red shadow-lg"
        />
      </div>

      {!showUploadForm ? (
        <Button
          onClick={() => setShowUploadForm(true)}
          className="w-full bg-capone-red hover:bg-capone-red-hover text-capone-white"
        >
          Changer la photo
        </Button>
      ) : (
        <div className="space-y-3 p-4 bg-capone-black rounded-lg border border-capone-grey">
          <div>
            <Label htmlFor="artist-file" className="text-capone-white">
              Sélectionner une nouvelle photo
            </Label>
            <Input
              id="artist-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red mt-2"
            />
            <p className="text-sm text-capone-white mt-2">
              💡 Recommandé: Photo carrée (512x512px minimum) pour un rendu optimal
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUploadPhoto}
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

export default ArtistPhotoManager;
