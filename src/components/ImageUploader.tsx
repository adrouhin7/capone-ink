import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  onUploadSuccess: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showError('Veuillez sélectionner un fichier à télécharger.');
      return;
    }

    setLoading(true);
    const toastId = showLoading('Téléchargement en cours...');

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      console.log('Upload start:', { fileName, fileSize: file.size, fileType: file.type });
      const { data, error } = await supabase.storage
        .from('Photo shop') // Ensure this bucket exists in Supabase
        .upload(fileName, file, {
          cacheControl: '0',
          upsert: false,
        });

      console.log('Upload response:', { data, error });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Upload success!', data);
      showSuccess('Image téléchargée avec succès !');
      setFile(null);
      
      // Wait a bit for Supabase to index the file before refreshing
      setTimeout(() => {
        console.log('Calling onUploadSuccess after delay');
        onUploadSuccess();
      }, 500);
    } catch (error: any) {
      console.error('Upload exception:', error);
      showError(`Erreur de téléchargement : ${error.message}`);
    } finally {
      dismissToast(toastId);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6 p-6 bg-capone-grey rounded-xl shadow-xl">
      <h3 className="text-2xl font-bold text-capone-red text-center">Télécharger une nouvelle image</h3>
      <div>
        <Label htmlFor="image-upload" className="text-capone-white text-lg">Sélectionner une image</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base file:text-capone-white file:bg-capone-red hover:file:bg-capone-red-hover file:rounded-full file:border-0 file:py-2 file:px-4 file:mr-4"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-3 px-6 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
        disabled={loading || !file}
      >
        {loading ? 'Téléchargement...' : 'Télécharger l\'image'}
      </Button>
    </form>
  );
};

export default ImageUploader;