import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { showSuccess, showError } from '@/utils/toast';

interface ScheduleDay {
  id: string;
  day: string;
  opening_time: string;
  closing_time: string;
  is_closed: boolean;
  order: number;
}

const ScheduleManager: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    { id: '0', day: 'Lundi', opening_time: '09:00', closing_time: '19:00', is_closed: false, order: 0 },
    { id: '1', day: 'Mardi', opening_time: '09:00', closing_time: '19:00', is_closed: false, order: 1 },
    { id: '2', day: 'Mercredi', opening_time: '09:00', closing_time: '19:00', is_closed: false, order: 2 },
    { id: '3', day: 'Jeudi', opening_time: '09:00', closing_time: '19:00', is_closed: false, order: 3 },
    { id: '4', day: 'Vendredi', opening_time: '09:00', closing_time: '19:00', is_closed: false, order: 4 },
    { id: '5', day: 'Samedi', opening_time: '09:00', closing_time: '19:00', is_closed: false, order: 5 },
    { id: '6', day: 'Dimanche', opening_time: '09:00', closing_time: '19:00', is_closed: true, order: 6 },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        setSchedule(data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleTimeChange = (index: number, field: 'opening_time' | 'closing_time', value: string) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const handleClosedChange = (index: number, value: boolean) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], is_closed: value };
    setSchedule(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      for (const day of schedule) {
        const { error } = await supabase
          .from('business_hours')
          .upsert({
            day: day.day,
            opening_time: day.opening_time,
            closing_time: day.closing_time,
            is_closed: day.is_closed,
            order: day.order,
          }, { onConflict: 'day' });
        if (error) throw error;
      }
      showSuccess('Horaires sauvegardés!');
    } catch (error: any) {
      showError('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-capone-grey rounded-lg p-6 border-2 border-capone-red">
      <h2 className="text-2xl font-bold text-capone-red mb-6">📅 Gestion des Horaires</h2>
      <div className="space-y-3">
        {schedule.map((day, index) => (
          <div key={index} className="bg-capone-black p-4 rounded border border-capone-grey">
            <div className="flex items-center justify-between mb-3">
              <span className="text-capone-white font-bold text-lg">{day.day}</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={day.is_closed}
                  onCheckedChange={(val) => handleClosedChange(index, val as boolean)}
                />
                <span className="text-capone-white text-sm">Fermé</span>
              </label>
            </div>
            {!day.is_closed && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  value={day.opening_time}
                  onChange={(e) => handleTimeChange(index, 'opening_time', e.target.value)}
                  className="bg-capone-grey text-capone-white text-sm"
                />
                <Input
                  type="time"
                  value={day.closing_time}
                  onChange={(e) => handleTimeChange(index, 'closing_time', e.target.value)}
                  className="bg-capone-grey text-capone-white text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-6 bg-capone-red hover:bg-capone-red-hover text-white font-bold py-2"
      >
        {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
      </Button>
    </div>
  );
};

export default ScheduleManager;
