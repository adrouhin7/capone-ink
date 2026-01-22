import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import { MapPin, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-capone-black min-h-screen text-capone-white py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>À Propos de Capone’Ink</SectionTitle>

        {/* Artist Presentation */}
        <section className="mb-16 max-w-4xl mx-auto bg-capone-grey rounded-xl p-8 shadow-xl">
          <h3 className="text-3xl font-bold text-capone-red mb-6 text-center">Notre Artiste</h3>
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <img
              src="/placeholder.svg" // Placeholder for artist's photo
              alt="Portrait de l'artiste tatoueur"
              className="w-48 h-48 rounded-full object-cover mb-6 md:mb-0 border-4 border-capone-red shadow-lg"
            />
            <div className="text-center md:text-left">
              <p className="text-capone-white text-lg leading-relaxed mb-4">
                Derrière Capone’Ink se trouve [Nom de l'artiste], un tatoueur passionné avec [X] années d'expérience. Spécialisé dans les styles [mentionner les styles, ex: réalisme noir et gris, fineline et old school], [Nom de l'artiste] met son talent et sa créativité au service de vos projets les plus audacieux.
              </p>
              <p className="text-capone-white text-lg leading-relaxed">
                Chaque trait est exécuté avec précision et dévouement, transformant votre peau en une toile vivante.
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
              <p className="text-capone-white text-lg">Du Lundi au Vendredi</p>
              <p className="text-capone-white text-lg">Sur rendez-vous uniquement</p>
              <p className="text-capone-white text-lg mt-2">Contactez-nous pour fixer un créneau.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;