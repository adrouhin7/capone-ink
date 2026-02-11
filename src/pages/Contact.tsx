import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import ContactForm from '@/components/ContactForm';
import LocationMap from '@/components/LocationMap';

const Contact: React.FC = () => {
  return (
    <div className="bg-capone-black min-h-screen text-capone-white py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Contact & Demande de Devis</SectionTitle>
        <p className="text-body text-center text-lg md:text-xl text-capone-white mb-12 max-w-3xl mx-auto">
          Vous avez une idée de tatouage ? Remplissez le formulaire ci-dessous pour nous décrire votre projet. Nous vous recontacterons rapidement pour discuter des détails et établir un devis personnalisé.
        </p>
        <ContactForm />
        <LocationMap />
      </div>
    </div>
  );
};

export default Contact;