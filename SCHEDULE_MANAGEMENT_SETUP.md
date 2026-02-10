# Gestion des Horaires - Guide de Configuration

Cette fonctionnalité permet de gérer les horaires d'ouverture depuis le panneau d'administration et les affiche dynamiquement sur l'ensemble du site.

## 📋 Composants

### 1. **ScheduleManager.tsx** (`src/components/ScheduleManager.tsx`)
- Composant de gestion des horaires dans le panneau admin
- Permet d'éditer les heures d'ouverture/fermeture pour chaque jour
- Permet de marquer un jour comme "fermé"
- Synchronise les données avec Supabase

### 2. **Pages affectées**
- **Home.tsx** - Affiche les horaires dans la section "Où nous trouver & Horaires"
- **Footer.tsx** - Affiche les horaires dans le pied de page
- **About.tsx** - Affiche les horaires dans la page À Propos

### 3. **Admin Panel** (`src/pages/Admin.tsx`)
- Intègre le ScheduleManager pour la gestion des horaires

## 🚀 Installation et Configuration

### Étape 1 : Créer la table Supabase

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Ouvrez l'**SQL Editor**
4. Copiez et collez le contenu du fichier `supabase/migrations/create_business_hours.sql`
5. Cliquez sur **Execute** (ou Exécuter)

Ou créez manuellement avec ce SQL :

```sql
CREATE TABLE IF NOT EXISTS business_hours (
  id BIGSERIAL PRIMARY KEY,
  day TEXT NOT NULL UNIQUE,
  opening_time TEXT NOT NULL DEFAULT '09:00',
  closing_time TEXT NOT NULL DEFAULT '19:00',
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Configuration RLS
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON business_hours
  FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users only" ON business_hours
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON business_hours
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Données par défaut
INSERT INTO business_hours (day, opening_time, closing_time, is_closed, "order") VALUES
  ('Lundi', '09:00', '19:00', false, 0),
  ('Mardi', '09:00', '19:00', false, 1),
  ('Mercredi', '09:00', '19:00', false, 2),
  ('Jeudi', '09:00', '19:00', false, 3),
  ('Vendredi', '09:00', '19:00', false, 4),
  ('Samedi', '09:00', '19:00', false, 5),
  ('Dimanche', '09:00', '19:00', true, 6)
ON CONFLICT (day) DO NOTHING;
```

### Étape 2 : Configurer les politiques RLS

Les politiques RLS (Row Level Security) sont déjà incluses dans le script SQL. Elles permettent :
- ✅ **Lecture (SELECT)** : Accessible à tous (pour afficher les horaires)
- ✅ **Écriture (UPDATE/INSERT)** : Réservée aux utilisateurs authentifiés (admin)

## 💻 Utilisation

### Modifier les horaires depuis l'Admin

1. Connectez-vous au panneau d'administration (`/admin`)
2. Allez à la section **"Gestion des Horaires"**
3. Pour chaque jour :
   - Définissez les heures d'ouverture et de fermeture
   - Cochez "Fermé" pour fermer le jour complet
4. Cliquez sur **"Sauvegarder les horaires"**

### Affichage sur le site

Les horaires s'affichent automatiquement dans :
- La page d'accueil (Home)
- Le pied de page (Footer)
- La page À Propos (About)

Les pages se mettent à jour automatiquement lors du chargement et récupèrent les dernières données de Supabase.

## 🔄 Fonctionnement

### Flux de données

```
Admin Panel (ScheduleManager)
    ↓
Sauvegarder → Supabase (business_hours table)
    ↓
Home/About/Footer ← Récupère les données au chargement
```

### Comportement par défaut

Si la table n'existe pas ou qu'aucune donnée n'est trouvée, l'application affiche les horaires par défaut :
- Lundi - Vendredi : 09:00 – 19:00
- Samedi : 09:00 – 19:00
- Dimanche : Fermé

## 🛡️ Sécurité

- Les horaires sont **publiquement lisibles** (nécessaire pour l'affichage)
- Les modifications sont **limitées aux utilisateurs authentifiés** (admin)
- La base de données utilise les **politiques RLS** de Supabase

## 📝 Structure de la table

```
id                INTEGER      (clé primaire)
day               TEXT         (nom du jour, ex: "Lundi")
opening_time      TEXT         (format HH:MM, ex: "09:00")
closing_time      TEXT         (format HH:MM, ex: "19:00")
is_closed         BOOLEAN      (true si fermé)
order             INTEGER      (ordre d'affichage 0-6)
created_at        TIMESTAMP    (date de création)
updated_at        TIMESTAMP    (date de modification)
```

## ✨ Fonctionnalités

✅ Modification facile des horaires depuis l'admin
✅ Support des jours fermés
✅ Affichage dynamique sur tout le site
✅ Fallback aux horaires par défaut si pas de données
✅ Interface intuitive avec Tailwind CSS et shadcn/ui
✅ Notifications toast de succès/erreur
✅ Synchronisation en temps réel avec Supabase

## 🐛 Dépannage

### Les horaires ne s'affichent pas
- Vérifiez que la table `business_hours` existe dans Supabase
- Vérifiez que les politiques RLS sont configurées pour permettre la lecture
- Vérifiez la console du navigateur pour les erreurs

### Je ne peux pas modifier les horaires
- Assurez-vous que vous êtes authentifié en tant qu'admin
- Vérifiez que la politique RLS `Enable update for authenticated users only` est présente
- Vérifiez que votre session Supabase est valide

### Les données ne se sauvegardent pas
- Vérifiez la connexion Supabase
- Vérifiez les logs dans la console du navigateur
- Assurez-vous que les colonnes de la table correspondent à ce qui est attendu

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
