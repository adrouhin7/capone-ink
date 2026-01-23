import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

// Importez supabase pour accéder à l'URL de base
import { supabase } from '@/lib/supabase';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom est requis.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }),
  phone: z.string().optional(),
  style: z.string().min(1, { message: 'Veuillez choisir un style.' }),
  size: z.string().min(1, { message: 'Veuillez indiquer la taille.' }),
  bodyArea: z.string().min(1, { message: 'Veuillez indiquer la zone du corps.' }),
  budget: z.string().min(1, { message: 'Veuillez indiquer votre budget.' }),
  message: z.string().min(10, { message: 'Veuillez décrire votre projet (min 10 caractères).' }),
});

const ContactForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      style: '',
      size: '',
      bodyArea: '',
      budget: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = showLoading('Envoi de votre demande...');
    try {
      // Construire l'URL de la fonction Edge Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL n\'est pas défini dans les variables d\'environnement.');
      }
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/send-contact-email`;

      const response = await fetch(edgeFunctionUrl, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si votre fonction Edge nécessite une clé d'API Supabase pour l'appel depuis le client, ajoutez-la ici.
          // Pour les fonctions Edge publiques, ce n'est généralement pas nécessaire.
          // 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi de la demande.');
      }

      showSuccess('Votre demande de devis a été envoyée avec succès !');
      form.reset();
    } catch (error: any) {
      showError(`Échec de l'envoi : ${error.message}`);
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-capone-grey rounded-xl shadow-xl max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="votre@email.com" {...field} className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Téléphone (optionnel)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="06 12 34 56 78" {...field} className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Style de tatouage souhaité</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base">
                    <SelectValue placeholder="Sélectionnez un style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-capone-black border-capone-grey text-capone-white">
                  <SelectItem value="realiste">Réaliste</SelectItem>
                  <SelectItem value="old-school">Old School</SelectItem>
                  <SelectItem value="fineline">Fineline</SelectItem>
                  <SelectItem value="graphique">Graphique</SelectItem>
                  <SelectItem value="traditionnel">Traditionnel</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Taille approximative (cm)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 10x15 cm" {...field} className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bodyArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Zone du corps</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Avant-bras, cuisse, dos..." {...field} className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Budget indicatif (€)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 300-500€" {...field} className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg h-12 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-capone-white text-lg">Décrivez votre projet</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre idée de tatouage, les éléments importants, les références..."
                  className="bg-capone-black border-capone-grey text-capone-white focus:ring-capone-red focus:border-capone-red rounded-lg min-h-[120px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-capone-red hover:bg-capone-red-hover text-capone-white font-bold py-3 px-6 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
        >
          Envoyer la demande
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;