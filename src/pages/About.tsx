import React, { useState, useEffect } from 'react';
import SectionTitle from '@/components/SectionTitle';
import { MapPin, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const About: React.FC = () => {
  const [artistPhotoUrl, setArtistPhotoUrl] = useState<string>('/placeholder.svg');

  useEffect(() => {
    const fetchArtistPhoto = async () => {
      try {
        const { data: files } = await supabase
          .storage
          .from('Photo shop')
          .list('artist-photo', { limit: 1 });

        if (files && files.length > 0) {
          const url = supabase
            .storage
            .from('Photo shop')
            .getPublicUrl(`artist-photo/${files[0].name}`).data.publicUrl;
          setArtistPhotoUrl(url);
        }
      } catch (error) {
        console.error('Error fetching artist photo:', error);
      }
    };

    fetchArtistPhoto();
  }, []);

  return (
    <div className="bg-capone-black min-h-screen text-capone-white py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>À Propos de Capone'Ink</SectionTitle>

        {/* Artist Presentation */}
        <section className="mb-16 max-w-4xl mx-auto bg-capone-grey rounded-xl p-8 shadow-xl">
          <h3 className="text-3xl font-bold text-capone-red mb-6 text-center">Notre Artiste</h3>
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <img
              src={artistPhotoUrl}
              alt="Portrait de l'artiste tatoueur"
              className="w-48 h-48 rounded-full object-cover mb-6 md:mb-0 border-4 border-capone-red shadow-lg"
            />
            <div className="text-center md:text-left">
              <p className="text-capone-white text-lg leading-relaxed mb-4">
                Derrière Capone'Ink se trouve Kewin, un tatoueur passionné depuis de nombreuses années. Pour lui, le tatouage n'est pas un travail mais une véritable passion. Spécialisé dans le noir et gris et maîtrisant une large variété de styles définis, il est capable de réaliser aussi bien des pièces détaillées que des créations old school jusqu'au réalisme.
              </p>
              <p className="text-capone-white text-lg leading-relaxed mb-4">
                Capone met son talent et sa créativité au service de projets uniques et personnalisés.
              </p>
              <p className="text-capone-white text-lg leading-relaxed">
                Chaque trait est exécuté avec précision et dévouement, transformant vos idées en œuvres d'art qui prennent vie sur la peau.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy & Hygiene */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-capone-grey rounded-xl p-8 shadow-xl flex flex-col items-center text-center">
            <HeartHandshake className="h-16 w-16 text-capone-red mb-6" />
            <h3 className="text-3xl font-bold text-capone-red mb-4">Notre Philosophie</h3>
            <p className="text-capone-white text-lg leading-relaxed">
              Chez Capone’Ink, nous croyons que le tatouage est une forme d'expression personnelle profonde. Nous nous engageons à écouter attentivement vos idées, à vous conseiller avec expertise et à créer une œuvre qui vous ressemble, dans le respect de votre vision et de votre corps.
            </p>
          </div>
          <div className="bg-capone-grey rounded-xl p-8 shadow-xl flex flex-col items-center text-center">
            <ShieldCheck className="h-16 w-16 text-capone-red mb-6" />
            <h3 className="text-3xl font-bold text-capone-red mb-4">Hygiène et Sécurité</h3>
            <p className="text-capone-white text-lg leading-relaxed">
              Votre sécurité est notre priorité absolue. Nous respectons scrupuleusement toutes les normes d'hygiène et de salubrité en vigueur. Tout le matériel est à usage unique et stérile, et notre espace de travail est désinfecté après chaque client.
            </p>
          </div>
        </section>

        {/* Location & Hours */}
        <section className="max-w-4xl mx-auto bg-capone-grey rounded-xl p-8 shadow-xl">
          <h3 className="text-3xl font-bold text-capone-red mb-6 text-center">Où nous trouver & Horaires</h3>
          <div className="flex flex-col md:flex-row justify-around items-center md:items-start space-y-8 md:space-y-0">
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <MapPin className="h-12 w-12 text-capone-red mb-4" />
              <p className="text-capone-white text-xl font-semibold mb-2">Adresse :</p>
              <p className="text-capone-white text-lg">8 Route de Tressandans,</p>
              <p className="text-capone-white text-lg">25680 Rougemont, France</p>
            </div>
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <Clock className="h-12 w-12 text-capone-red mb-4" />
              <p className="text-capone-white text-xl font-semibold mb-2">Horaires :</p>
              <p className="text-capone-white text-lg">Lundi : 09:00 – 19:00</p>
              <p className="text-capone-white text-lg">Mardi : 09:00 – 19:00</p>
              <p className="text-capone-white text-lg">Mercredi : 09:00 – 19:00</p>
              <p className="text-capone-white text-lg">Jeudi : 09:00 – 19:00</p>
              <p className="text-capone-white text-lg">Vendredi : 09:00 – 19:00</p>
              <p className="text-capone-white text-lg">Samedi : 09:00 – 19:00</p>
              <p className="text-capone-white text-lg mt-2">Dimanche : Fermé</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;