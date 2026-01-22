import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import { Card } from '@/components/ui/card'; // Using shadcn Card for pricing examples
import { cn } from '@/lib/utils';

interface PricingCardProps {
  title: string;
  priceRange: string;
  description: string;
  features: string[];
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, priceRange, description, features, className }) => {
  return (
    <Card className={cn(
      "bg-capone-grey border-capone-red rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105",
      className
    )}>
      <h3 className="text-3xl font-bold text-capone-red mb-4">{title}</h3>
      <p className="text-4xl font-extrabold text-capone-white mb-6">{priceRange}</p>
      <p className="text-capone-white text-lg mb-6">{description}</p>
      <ul className="space-y-3 text-capone-white text-base mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-capone-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-400 mt-auto">Le prix final dépendra de la complexité et des détails du design.</p>
    </Card>
  );
};

const Pricing: React.FC = () => {
  return (
    <div className="bg-capone-black min-h-screen text-capone-white py-16">
      <div className="container mx-auto px-4">
        <SectionTitle>Nos Tarifs</SectionTitle>
        <p className="text-center text-lg md:text-xl text-capone-white mb-12 max-w-3xl mx-auto">
          Chaque projet est unique. Voici une estimation de nos tarifs pour vous donner une idée. Un devis précis sera établi après consultation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PricingCard
            title="Petit Tatouage"
            priceRange="À partir de 80€"
            description="Idéal pour les symboles discrets, les initiales ou les petits motifs."
            features={["Design simple", "Taille max 5x5 cm", "Consultation incluse"]}
          />
          <PricingCard
            title="Moyen Tatouage"
            priceRange="200€ - 500€"
            description="Pour des pièces plus élaborées, des écritures plus longues ou des motifs de taille moyenne."
            features={["Design personnalisé", "Taille 5x5 cm à 15x15 cm", "Retouches initiales incluses"]}
          />
          <PricingCard
            title="Grand Tatouage"
            priceRange="À partir de 500€"
            description="Pour les grandes pièces, les manches, les dos ou les projets complexes nécessitant plusieurs sessions."
            features={["Design complexe", "Plusieurs sessions possibles", "Suivi post-tatouage"]}
          />
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-capone-red mb-6">Comment obtenir un devis ?</h3>
          <p className="text-capone-white text-lg mb-6">
            Pour un devis précis, nous vous invitons à remplir notre formulaire de contact détaillé. Cela nous permettra de comprendre au mieux votre projet et de vous proposer une estimation juste.
          </p>
          <Button asChild className="bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105">
            <Link to="/contact">Demander un devis</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;