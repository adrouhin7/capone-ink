import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-capone-black text-capone-white py-12 mt-16 border-t border-capone-grey">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo and Slogan */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="text-4xl font-extrabold text-capone-red tracking-wider mb-4">
            Capone’Ink
          </Link>
          <p className="text-capone-white text-lg">L'art du tatouage, une encre, une histoire.</p>
        </div>

        {/* Address and Hours */}
        <div>
          <h3 className="text-2xl font-semibold text-capone-red mb-4">Nous trouver</h3>
          <p className="flex items-center justify-center md:justify-start text-capone-white mb-2">
            <MapPin className="mr-2 h-5 w-5 text-capone-red" />
            8 Route de Tressandans, 25680 Rougemont, France
          </p>
          <h3 className="text-2xl font-semibold text-capone-red mb-4 mt-6">Horaires</h3>
          <p className="flex items-center justify-center md:justify-start text-capone-white">
            <Clock className="mr-2 h-5 w-5 text-capone-red" />
            Sur rendez-vous uniquement
          </p>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-2xl font-semibold text-capone-red mb-4">Suivez-nous</h3>
          <div className="flex space-x-6">
            <a href="https://www.instagram.com/caponeinktattoo" target="_blank" rel="noopener noreferrer" className="text-capone-white hover:text-capone-red transition-colors duration-300">
              <Instagram className="h-8 w-8" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-capone-white hover:text-capone-red transition-colors duration-300">
              <Facebook className="h-8 w-8" />
            </a>
          </div>
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              <a
                href="https://www.dyad.sh/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                Made with Dyad
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} Capone’Ink Tattoo. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;