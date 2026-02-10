import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { MapPin, Clock, Instagram, Facebook } from 'lucide-react';

interface ScheduleDay {
  id: string;
  day: string;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
  order: number;
}

const Footer: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.log('Schedule table not found, using defaults');
        initializeDefaultSchedule();
      } else if (data && data.length > 0) {
        setSchedule(data);
      } else {
        initializeDefaultSchedule();
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      initializeDefaultSchedule();
    }
  };

  const initializeDefaultSchedule = () => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const defaultSchedule: ScheduleDay[] = days.map((day, index) => ({
      id: `${index}`,
      day,
      opening_time: '09:00',
      closing_time: '19:00',
      is_closed: day === 'Dimanche',
      order: index,
    }));
    setSchedule(defaultSchedule);
  };
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
          <div className="text-capone-white text-lg flex flex-col items-center md:items-start">
            {schedule.length > 0 ? (
              schedule.map((day) => (
                <p key={day.order} className="flex items-center mb-1">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  {day.day} : {day.is_closed ? 'Fermé' : `${day.opening_time} – ${day.closing_time}`}
                </p>
              ))
            ) : (
              <>
                <p className="flex items-center mb-1">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  Lundi : 09:00 – 19:00
                </p>
                <p className="flex items-center mb-1">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  Mardi : 09:00 – 19:00
                </p>
                <p className="flex items-center mb-1">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  Mercredi : 09:00 – 19:00
                </p>
                <p className="flex items-center mb-1">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  Jeudi : 09:00 – 19:00
                </p>
                <p className="flex items-center mb-1">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  Vendredi : 09:00 – 19:00
                </p>
                <p className="flex items-center mb-1">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  Samedi : 09:00 – 19:00
                </p>
                <p className="flex items-center mt-2">
                  <Clock className="mr-2 h-5 w-5 text-capone-red" />
                  Dimanche : Fermé
                </p>
              </>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-2xl font-semibold text-capone-red mb-4">Suivez-nous</h3>
          <div className="flex space-x-6">
            <a href="https://www.instagram.com/caponeinktattoo/" target="_blank" rel="noopener noreferrer" className="text-capone-white hover:text-capone-red transition-colors duration-300">
              <Instagram className="h-8 w-8" />
            </a>
            <a href="https://www.facebook.com/people/CaponeInk-Tattoo/100091298688494/" target="_blank" rel="noopener noreferrer" className="text-capone-white hover:text-capone-red transition-colors duration-300">
              <Facebook className="h-8 w-8" />
            </a>
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