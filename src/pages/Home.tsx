import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import CardTattooStyle from '@/components/CardTattooStyle';
import GalleryGrid from '@/components/GalleryGrid';
import TattooMachine from '@/components/TattooMachine';
import { MapPin, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import LocationMap from '@/components/LocationMap';
import { showError } from '@/utils/toast';

interface StyleData {
  title: string;
  imageUrl: string;
  description: string;
}

interface GalleryImage {
  id: string;
  name: string;
  url: string;
}

const Home: React.FC = () => {
  const [styles, setStyles] = useState<StyleData[]>([
    {
      title: 'Réaliste',
      imageUrl: '/placeholder.svg',
      description: 'Capturer la vie et l\'émotion avec une précision photographique, pour des portraits et des scènes d\'une profondeur incroyable.',
    },
    {
      title: 'Old School',
      imageUrl: '/placeholder.svg',
      description: 'Des lignes audacieuses, des couleurs vives et des motifs intemporels qui rendent hommage aux classiques du tatouage traditionnel.',
    },
    {
      title: 'Fineline',
      imageUrl: '/placeholder.svg',
      description: 'L\'élégance de la simplicité. Des lignes fines et délicates pour des designs minimalistes, des écritures ou des motifs subtils.',
    },
  ]);

  const [heroBackground, setHeroBackground] = useState<string>('/hero-background.jpg');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [barberImages, setBarberImages] = useState<GalleryImage[]>([]);
  const [artistPhotoUrl, setArtistPhotoUrl] = useState<string>('/placeholder.svg');

  const fetchStylesImages = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('Photo shop')
        .list('styles-phares', { limit: 10 });

      if (error || !files) {
        console.log('Using default placeholder images');
        return;
      }

      const styleIds = ['realiste', 'old-school', 'fineline'];
      const updatedStyles = styles.map((style, index) => {
        const styleId = styleIds[index];
        const fileForStyle = files.find((f) => f.name.startsWith(styleId));

        if (fileForStyle) {
          const url = supabase.storage
            .from('Photo shop')
            .getPublicUrl(`styles-phares/${fileForStyle.name}`).data.publicUrl;
          return { ...style, imageUrl: url };
        }
        return style;
      });

      setStyles(updatedStyles);
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  };

  const fetchHeroBackground = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('Photo shop')
        .list('hero-background', { limit: 1 });

      if (error || !files || files.length === 0) {
        console.log('Using default hero background');
        return;
      }

      const url = supabase.storage
        .from('Photo shop')
        .getPublicUrl(`hero-background/${files[0].name}`).data.publicUrl;

      setHeroBackground(url);
    } catch (error) {
      console.error('Error fetching hero background:', error);
    }
  };

  const fetchGalleryImages = async () => {
    setGalleryLoading(true);
    try {
      const { data, error } = await supabase.storage.from('Photo shop').list('', {
        limit: 100,
        offset: 0,
      });

      if (error) {
        throw error;
      }

      const excludedFolders = ['artist-photo', 'hero-background', 'styles-phares', 'barber-images'];
      const visibleImages = data.filter((file) =>
        !excludedFolders.includes(file.name)
      );

      const fetchedImages: GalleryImage[] = visibleImages.map((file) => ({
        id: file.id,
        name: file.name,
        url: supabase.storage.from('Photo shop').getPublicUrl(file.name).data.publicUrl,
      }));
      setGalleryImages(fetchedImages);
    } catch (error: any) {
      showError(`Erreur lors du chargement des images de la galerie : ${error.message}`);
    } finally {
      setGalleryLoading(false);
    }
  };

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

  const fetchBarberImages = async () => {
    try {
      const { data, error } = await supabase.storage.from('Photo shop').list('barber-images', {
        limit: 100,
        offset: 0,
      });

      if (error) {
        throw error;
      }

      const fetchedImages: GalleryImage[] = data.map((file) => ({
        id: file.id,
        name: file.name,
        url: supabase.storage.from('Photo shop').getPublicUrl(`barber-images/${file.name}`).data.publicUrl,
      }));
      setBarberImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching barber images:', error);
    }
  };

  useEffect(() => {
    fetchStylesImages();
    fetchHeroBackground();
    fetchGalleryImages();
    fetchBarberImages();
    fetchArtistPhoto();
  }, []);

  return (
    <div className="bg-capone-black text-capone-white" style={{ position: "relative" }}>
      <TattooMachine />
      {/* ACCUEIL SECTION */}
      <section id="accueil" className="min-h-screen">
        {/* Hero Section */}
        <div
          className="relative h-[70vh] md:h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBackground}')` }}
        >
          <div className="absolute inset-0 bg-capone-black opacity-70"></div>
          <div className="relative z-10 px-4 pt-48 pb-4 max-w-4xl mx-auto">
            {/* Logo en haut à droite */}
            <img
              src="/logo.webp"
              alt="Capone'Ink Tattoo Logo"
              className="absolute top-0 right-4 w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-capone-red shadow-lg"
            />
            <h1 className="ink-title text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-capone-white drop-shadow-lg animate-fade-in">
              Capone'Ink Tattoo
            </h1>
            <p className="text-xl md:text-2xl text-capone-white mb-10 animate-fade-in delay-200">
              L'art du tatouage, une encre, une histoire.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in delay-400">
              <Button asChild className="ink-button bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105">
                <a href="#galerie">Voir la galerie</a>
              </Button>
              <Button asChild variant="outline" className="ink-button border-capone-red text-capone-red hover:bg-capone-red hover:text-capone-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105">
                <a href="#contact">Demander un devis</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Shop Presentation Section */}
        <div className="container mx-auto py-16 px-4">
          <SectionTitle>Bienvenue chez Capone'Ink</SectionTitle>
          <div className="max-w-3xl mx-auto text-center text-lg md:text-xl leading-relaxed text-capone-white">
            <p className="mb-6">
              Situé à Rougemont, Capone'Ink Tattoo est un studio dédié à l'art corporel, où chaque tatouage est une œuvre unique, pensée et réalisée avec passion. Nous mettons un point d'honneur à créer des pièces qui racontent votre histoire, dans un environnement sûr et inspirant.
            </p>
            <p>
              Notre approche personnalisée garantit une expérience mémorable, de la conception à la réalisation. Venez découvrir notre univers et laissez-nous transformer vos idées en art.
            </p>
          </div>
        </div>

        {/* Tattoo Styles Section */}
        <div className="container mx-auto py-16 px-4">
          <SectionTitle>Nos Styles Phares</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {styles.map((style) => (
              <CardTattooStyle
                key={style.title}
                title={style.title}
                description={style.description}
                imageUrl={style.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE SECTION */}
      <section id="galerie" className="min-h-screen bg-capone-black py-16">
        <div className="container mx-auto px-4">
          <SectionTitle>Notre Galerie</SectionTitle>
          <p className="text-center text-lg md:text-xl text-capone-white mb-12 max-w-3xl mx-auto">
            Découvrez un aperçu de nos réalisations. Chaque pièce est unique et reflète la personnalité de nos clients.
          </p>
          {galleryLoading ? (
            <div className="text-center text-capone-white text-xl">
              Chargement de la galerie...
            </div>
          ) : galleryImages.length === 0 ? (
            <p className="text-center text-capone-white text-lg">Aucune image à afficher pour le moment. L'administrateur peut en ajouter via le panneau d'administration.</p>
          ) : (
            <GalleryGrid images={galleryImages} />
          )}
        </div>
      </section>

      {/* BARBER GANG SECTION */}
      {/* À PROPOS SECTION */}
      <section id="apropos" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <SectionTitle>À Propos de Capone'Ink</SectionTitle>

          {/* Artist Presentation */}
          <div className="mb-16 max-w-4xl mx-auto bg-capone-grey rounded-xl p-8 shadow-xl">
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
          </div>

          {/* Philosophy & Hygiene */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-capone-grey rounded-xl p-8 shadow-xl flex flex-col items-center text-center">
              <HeartHandshake className="h-16 w-16 text-capone-red mb-6" />
              <h3 className="text-3xl font-bold text-capone-red mb-4">Notre Philosophie</h3>
              <p className="text-capone-white text-lg leading-relaxed">
                Chez Capone'Ink, nous croyons que le tatouage est une forme d'expression personnelle profonde. Nous nous engageons à écouter attentivement vos idées, à vous conseiller avec expertise et à créer une œuvre qui vous ressemble, dans le respect de votre vision et de votre corps.
              </p>
            </div>
            <div className="bg-capone-grey rounded-xl p-8 shadow-xl flex flex-col items-center text-center">
              <ShieldCheck className="h-16 w-16 text-capone-red mb-6" />
              <h3 className="text-3xl font-bold text-capone-red mb-4">Hygiène et Sécurité</h3>
              <p className="text-capone-white text-lg leading-relaxed">
                Votre sécurité est notre priorité absolue. Nous respectons scrupuleusement toutes les normes d'hygiène et de salubrité en vigueur. Tout le matériel est à usage unique et stérile, et notre espace de travail est désinfecté après chaque client.
              </p>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="max-w-4xl mx-auto bg-capone-grey rounded-xl p-8 shadow-xl">
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
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <SectionTitle>Contact & Demande de Devis</SectionTitle>
          <p className="text-center text-lg md:text-xl text-capone-white mb-12 max-w-3xl mx-auto">
            Vous avez une idée de tatouage ? Remplissez le formulaire ci-dessous pour nous décrire votre projet. Nous vous recontacterons rapidement pour discuter des détails et établir un devis personnalisé.
          </p>
          <ContactForm />
          <LocationMap />
        </div>
      </section>

      {/* BARBER GANG SECTION */}
      <section id="barber-gang" className="min-h-screen bg-capone-black py-16">
        <div className="container mx-auto px-4">
          <SectionTitle>Barber gang By NaNa</SectionTitle>
          <p className="text-center text-lg md:text-xl text-capone-white mb-12 max-w-3xl mx-auto">
            Retrouvez aussi notre barber présente au shop Capone'Ink. Coiffure, rasage et entretien avec passion et professionnalisme.
          </p>
          {barberImages.length === 0 ? (
            <p className="text-center text-capone-white text-lg">Aucune image à afficher pour le moment.</p>
          ) : (
            <GalleryGrid images={barberImages} />
          )}
          <div className="flex justify-center mt-12">
            <a
              href="https://www.planity.com/barber-gang-by-nana-25680-rougemont"
              target="_blank"
              rel="noopener noreferrer"
              className="ink-button bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Prendre RDV
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
