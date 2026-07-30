# Configuration PayloadCMS pour Atelier Desnoyers

## Prérequis

1. **PostgreSQL** - Base de données pour PayloadCMS
   - Option recommandée : Supabase (gratuit, PostgreSQL hébergé)
   - Alternative : PostgreSQL local (nécessite installation)

## Configuration de Supabase (Gratuit)

### 1. Créer un compte Supabase

1. Allez sur https://supabase.com/dashboard
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub, Google ou créez un compte email

### 2. Créer un nouveau projet

1. Cliquez sur "New Project"
2. Remplissez les informations :
   - **Name** : `atelier-desnoyers` (ou le nom de votre choix)
   - **Database Password** : Créez un mot de passe fort et **NOTEZ-LE** (vous en aurez besoin !)
   - **Region** : Choisissez "Europe (West)" pour de meilleures performances
   - **Pricing Plan** : Sélectionnez **FREE** (2 GB de stockage, largement suffisant)
3. Cliquez sur "Create new project"
4. Attendez quelques minutes que le projet soit créé

### 3. Obtenir la chaîne de connexion

1. Une fois le projet créé, allez dans **Settings** (icône engrenage dans la barre latérale)
2. Cliquez sur **Database** dans le menu de gauche
3. Faites défiler jusqu'à **Connection string**
4. Sélectionnez l'onglet **URI**
5. Copiez la chaîne de connexion (elle ressemble à) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **Important** : Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez créé à l'étape 2

### 4. Configurer le fichier .env

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez la ligne `DATABASE_URI` avec votre chaîne de connexion Supabase :
   ```
   DATABASE_URI=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
3. Remplacez également `PAYLOAD_SECRET` avec une clé secrète aléatoire (minimum 32 caractères)

   Exemple pour générer une clé secrète :
   ```bash
   openssl rand -base64 32
   ```

## Démarrage du serveur PayloadCMS

### Mode développement

```bash
npm run payload:dev
```

Le serveur démarrera sur http://localhost:5000

L'interface d'administration sera accessible sur http://localhost:5000/admin

### Mode production

```bash
npm run payload
```

## Première connexion

1. Accédez à http://localhost:5000/admin
2. Créez votre premier utilisateur administrateur
3. Vous pouvez maintenant gérer le contenu via l'interface

## Collection de test

Une collection "Test Texts" a été créée avec deux champs :
- **Titre** : Titre du contenu
- **Contenu** : Texte du contenu

Cette collection permet de tester le fonctionnement de PayloadCMS avant d'ajouter les collections complètes (portfolio, blog, etc.)

## Prochaines étapes

1. Tester la connexion à MongoDB Atlas
2. Créer le premier utilisateur admin
3. Ajouter un élément de test dans la collection "Test Texts"
4. Configurer les collections pour le portfolio et le blog
5. Déployer sur Infomaniak avec Node.js

## Déploiement sur Infomaniak

### Configuration requise sur Infomaniak

- Node.js activé
- Variables d'environnement :
  - `DATABASE_URI` : Votre URL MongoDB Atlas
  - `PAYLOAD_SECRET` : Votre clé secrète
  - `PAYLOAD_PUBLIC_SERVER_URL` : URL de votre site (ex: https://atelier-desnoyers.com)
  - `PORT` : Port fourni par Infomaniak

### Structure des fichiers

- Le site React/Vite sera dans `/dist` après build
- Le serveur PayloadCMS servira à la fois l'admin CMS et l'API
- Le même domaine sera utilisé pour le site et le CMS
