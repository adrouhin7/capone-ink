import React from 'react';

const LocationMap: React.FC = () => {
  const shopAddress = "8 Route de Tressandans, 25680 Rougemont, France";
  const mapsSearchUrl = `https://www.google.com/maps?q=${encodeURIComponent(shopAddress)}`;
  
  return (
    <div className="mt-16 w-full max-w-4xl mx-auto px-4">
      <h3 className="text-2xl font-bold text-capone-red mb-6 text-center">Visitez notre studio</h3>
      <a 
        href={mapsSearchUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="block rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2697.1234567890!2d6.5850!3d47.4850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479097d5c5c5c5c5%3A0x1234567890abcdef!2s8%20Route%20de%20Tressandans%2C%2025680%20Rougemont%2C%20France!5e0!3m2!1sfr!2sfr!4v1234567890000"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: '12px', display: 'block' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </a>
      <p className="text-center text-capone-white mt-4 text-sm">
        Cliquez sur la carte pour lancer Google Maps et obtenir l'itinéraire
      </p>
    </div>
  );
};

export default LocationMap;
