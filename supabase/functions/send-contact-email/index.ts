import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Configuration CORS pour permettre les requêtes depuis votre frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Remplacez par l'URL de votre frontend en production pour plus de sécurité
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// --- AJOUT DES LOGS DE DÉBOGAGE ICI ---
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
console.log('DEBUG: RESEND_API_KEY est défini:', !!RESEND_API_KEY); // Affiche true ou false
const CONTACT_EMAIL_TO = Deno.env.get('CONTACT_EMAIL_TO');
console.log('DEBUG: CONTACT_EMAIL_TO est défini:', !!CONTACT_EMAIL_TO); // Affiche true ou false
const CONTACT_EMAIL_FROM = Deno.env.get('CONTACT_EMAIL_FROM');
console.log('DEBUG: CONTACT_EMAIL_FROM est défini:', !!CONTACT_EMAIL_FROM); // Affiche true ou false
// --- FIN DES LOGS DE DÉBOGAGE ---


serve(async (req) => {
  // Gérer les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Assurez-vous que la requête est une méthode POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée. Seules les requêtes POST sont acceptées.' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Récupérer les secrets depuis Supabase Vault
    // Ces variables sont déjà lues au niveau supérieur, nous les utilisons ici.
    // La vérification est déplacée ici pour s'assurer qu'elle est dans le bloc try/catch
    if (!RESEND_API_KEY || !CONTACT_EMAIL_TO || !CONTACT_EMAIL_FROM) {
      throw new Error('Clés API Resend ou adresses e-mail de contact manquantes dans les secrets Supabase.');
    }

    // Lire le corps de la requête JSON
    const { name, email, phone, style, size, bodyArea, budget, message } = await req.json();

    // Validation simple des données reçues
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Les champs nom, email et message sont requis.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Construire le contenu de l'e-mail
    const emailSubject = `Nouvelle demande de devis de ${name} (${email})`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
          h2 { color: #8B0000; }
          ul { list-style: none; padding: 0; }
          li { margin-bottom: 10px; }
          strong { color: #555; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Nouvelle demande de devis Capone’Ink</h2>
          <ul>
            <li><strong>Nom :</strong> ${name}</li>
            <li><strong>Email :</strong> ${email}</li>
            <li><strong>Téléphone :</strong> ${phone || 'Non fourni'}</li>
            <li><strong>Style de tatouage :</strong> ${style}</li>
            <li><strong>Taille approximative :</strong> ${size}</li>
            <li><strong>Zone du corps :</strong> ${bodyArea}</li>
            <li><strong>Budget indicatif :</strong> ${budget}</li>
            <li><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</li>
          </ul>
          <p>Ceci est une demande de devis envoyée via le formulaire de contact de votre site web.</p>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'e-mail via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: CONTACT_EMAIL_FROM,
        to: CONTACT_EMAIL_TO,
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      throw new Error(`Erreur de l'API Resend : ${errorData.message || JSON.stringify(errorData)}`);
    }

    // Réponse en cas de succès
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    // Gérer toutes les erreurs et renvoyer une réponse JSON cohérente
    console.error('Erreur dans la fonction Edge send-contact-email:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur inattendue est survenue.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});