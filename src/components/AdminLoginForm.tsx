import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showError(error.message);
      } else {
        showSuccess('Connexion réussie !');
        onLoginSuccess();
      }
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6 p-8 bg-capone-grey rounded-xl shadow-xl max-w-md mx-auto">
      <h3 className="text-3xl font-bold text-capone-red mb-6 text-center">Connexion Admin</h3>
      <div>
        <Label htmlFor="email" className="text-capone-white text-lg">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@caponeink.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-capone-white text-lg">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-3 px-6 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
        disabled={loading}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
};

export default AdminLoginForm;