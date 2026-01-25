import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLoginForm from '@/components/AdminLoginForm';
import ImageUploader from '@/components/ImageUploader';
import AdminGalleryManager from '@/components/AdminGalleryManager';
import StylesPhairesManager from '@/components/StylesPhairesManager';
import HeroBackgroundManager from '@/components/HeroBackgroundManager';
import ArtistPhotoManager from '@/components/ArtistPhotoManager';
import BarberGalleryManager from '@/components/BarberGalleryManager';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [key, setKey] = useState(0); // Used to force re-render of AdminGalleryManager

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      showSuccess('Déconnexion réussie.');
    } catch (error: any) {
      showError(`Erreur de déconnexion : ${error.message}`);
    }
  };

  const handleImageChange = () => {
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
  };

  if (!session) {
    return (
      <div className="bg-capone-black min-h-screen flex items-center justify-center py-16">
        <AdminLoginForm onLoginSuccess={() => setKey(prevKey => prevKey + 1)} />
      </div>
    );
  }

  return (
    <div className="bg-capone-black min-h-screen text-capone-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <SectionTitle className="mb-0">Panneau d'Administration</SectionTitle>
          <Button
            onClick={handleLogout}
            className="bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-2 px-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ImageUploader onUploadSuccess={handleImageChange} />
          <AdminGalleryManager refreshTrigger={key} />
        </div>

        <div className="mt-12">
          <StylesPhairesManager />
        </div>

        <div className="mt-12">
          <HeroBackgroundManager />
        </div>

        <div className="mt-12">
          <ArtistPhotoManager />
        </div>

        <div className="mt-12">
          <BarberGalleryManager />
        </div>
      </div>
    </div>
  );
};

export default Admin;