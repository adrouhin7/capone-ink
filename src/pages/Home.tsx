import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/SectionTitle';
import CardTattooStyle from '@/components/CardTattooStyle';

const Home: React.FC = () => {
  return (
    <div className="bg-capone-black min-h-screen text-capone-white">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] md:h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-background.jpg')" }}
      >
        <div className="absolute inset-0 bg-capone-black opacity-70"></div>
        <div className="relative z-10 px-4 pt-48 pb-4 max-w-4xl mx-auto"> {/* Augmentation du pt- à pt-48 */}
          {/* Logo en haut à droite */}
          <img
            src="/logo.webp"
            alt="Capone’Ink Tattoo Logo"
            className="absolute top-0 right-4 w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-capone-red shadow-lg"
          />
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-capone-white drop-shadow-lg animate-fade-in">
            Capone’Ink Tattoo
          </h1>
          <p className="text-xl md:text-2xl text-capone-white mb-10 animate-fade-in delay-200">
            L'art du tatouage, une encre, une histoire.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in delay-400">
            <Button asChild className="bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/gallery">Voir la galerie</Link>
            </Button>
            <Button asChild variant="outline" className="border-capone-red text-capone-red hover:bg-capone-red hover:text-capone-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/contact">Demander un devis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Shop Presentation Section */}
      <section className="container mx-auto py-16 px-4">
        <SectionTitle>Bienvenue chez Capone’Ink</SectionTitle>
        <div className="max-w-3xl mx-auto text-center text-lg md:text-xl leading-relaxed text-capone-white">
          <p className="mb-6">
            Situé à Rougemont, Capone’Ink Tattoo est un studio dédié à l'art corporel, où chaque tatouage est une œuvre unique, pensée et réalisée avec passion. Nous mettons un point d'honneur à créer des pièces qui racontent votre histoire, dans un environnement sûr et inspirant.
          </p>
          <p>
            Notre approche personnalisée garantit une expérience mémorable, de la conception à la réalisation. Venez découvrir notre univers et laissez-nous transformer vos idées en art.
          </p>
        </div>
      </section>

      {/* Tattoo Styles Section */}
      <section className="container mx-auto py-16 px-4">
        <SectionTitle>Nos Styles Phares</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CardTattooStyle
            title="Réaliste"
            description="Capturer la vie et l'émotion avec une précision photographique, pour des portraits et des scènes d'une profondeur incroyable."
            imageUrl="/placeholder.svg" // Placeholder image
          />
          <CardTattooStyle
            title="Old School"
            description="Des lignes audacieuses, des couleurs vives et des motifs intemporels qui rendent hommage aux classiques du tatouage traditionnel."
            imageUrl="/placeholder.svg" // Placeholder image
          />
          <CardTattooStyle
            title="Fineline"
            description="L'élégance de la simplicité. Des lignes fines et délicates pour des designs minimalistes, des écritures ou des motifs subtils."
            imageUrl="/placeholder.svg" // Placeholder image
          />
        </div>
      </section>
    </div>
  );
};

export default Home;