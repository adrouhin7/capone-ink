import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Accueil', path: '#accueil' },
  { name: 'Galerie', path: '#galerie' },
  { name: 'À propos', path: '#apropos' },
  { name: 'Contact', path: '#contact' },
  { name: 'Barber gang', path: '#barber-gang' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-capone-black text-capone-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="gothic-logo text-capone-red tracking-wider">
          Capone’Ink
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-lg font-medium hover:text-capone-red transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
          {/* Le logo a été déplacé hors du Header */}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-capone-white hover:bg-capone-grey">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-capone-black text-capone-white border-capone-grey w-3/4 sm:max-w-xs">
              <div className="flex flex-col items-start space-y-6 pt-8">
                <Link to="/" className="gothic-logo text-capone-red tracking-wider mb-4" onClick={() => setIsOpen(false)}>
                  Capone’Ink
                </Link>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-2xl font-semibold hover:text-capone-red transition-colors duration-300 w-full py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                {/* Le logo a été déplacé hors du Header */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;