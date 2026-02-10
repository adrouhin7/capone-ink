import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

interface BusinessHour {
  id: string;
  day: string;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
  order: number;
}

const BusinessHoursManager: React.FC = () => {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    console.log('📅 BusinessHoursManager monté');
    loadHours();
  }, []);

  const loadHours = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des horaires...');
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('order', { ascending: true });

      console.log('📊 Données reçues:', data);
      console.log('❌ Erreur:', error);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setHours(data as BusinessHour[]);
        console.log('✅ Horaires chargés:', data);
      } else {
        console.log('⚠️ Aucun enregistrement trouvé');
      }
    } catch (error) {
      console.error('💥 Erreur loading hours:', error);
      showError('Erreur lors du chargement des horaires');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const toastId = showLoading('Sauvegarde des horaires...');

    try {
      for (const hour of hours) {
        const { error } = await supabase
          .from('business_hours')
          .update({
            opening_time: hour.opening_time,
            closing_time: hour.closing_time,
            is_closed: hour.is_closed,
          })
          .eq('id', hour.id);

        if (error) throw error;
      }

      dismissToast(toastId as string);
      showSuccess('Horaires sauvegardés avec succès!');
      await loadHours();
    } catch (error: any) {
      dismissToast(toastId as string);
      console.error('Error saving hours:', error);
      showError(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateHour = (id: string, field: string, value: string | boolean) => {
    setHours(hours.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  if (loading) {
    return (
      <Card className="bg-capone-grey border border-capone-red">
        <CardHeader>
          <CardTitle className="text-capone-red">📅 Horaires d'ouverture</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-capone-white">Chargement des horaires...</p>
        </CardContent>
      </Card>
    );
  }

  if (!hours || hours.length === 0) {
    return (
      <Card className="bg-capone-grey border border-capone-red">
        <CardHeader>
          <CardTitle className="text-capone-red">📅 Horaires d'ouverture</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-capone-white text-red-500">❌ Aucun horaire trouvé en base de données</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-capone-grey border border-capone-red">
      <CardHeader>
        <CardTitle className="text-capone-red">📅 Horaires d'ouverture</CardTitle>
        <p className="text-capone-white text-sm mt-2">Modifiez les horaires du salon Capone'Ink</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          {hours.map((hour) => (
            <div 
              key={hour.id} 
              className="bg-capone-black p-4 rounded border border-capone-grey flex items-center gap-4"
            >
              <div className="w-24 font-bold text-capone-white">
                {hour.day || `Jour ${hour.order}`}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="time"
                  value={hour.opening_time || '09:00'}
                  onChange={(e) => updateHour(hour.id, 'opening_time', e.target.value)}
                  disabled={hour.is_closed}
                  className="border border-capone-red rounded px-2 py-1 bg-capone-grey text-capone-white text-sm cursor-pointer disabled:opacity-50"
                />
                <span className="text-capone-white text-sm">Ouverture</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="time"
                  value={hour.closing_time || '19:00'}
                  onChange={(e) => updateHour(hour.id, 'closing_time', e.target.value)}
                  disabled={hour.is_closed}
                  className="border border-capone-red rounded px-2 py-1 bg-capone-grey text-capone-white text-sm cursor-pointer disabled:opacity-50"
                />
                <span className="text-capone-white text-sm">Fermeture</span>
              </label>

              <label className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  checked={hour.is_closed}
                  onChange={(e) => updateHour(hour.id, 'is_closed', e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-capone-white text-sm">Fermé</span>
              </label>
            </div>
          ))}

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-2 mt-6"
          >
            {saving ? '⏳ Sauvegarde...' : '💾 Enregistrer les horaires'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursManager;
