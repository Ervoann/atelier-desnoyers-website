# Guide de Migration Supabase

## 📋 Résumé
Migration de la base de données Supabase actuelle vers un nouveau projet Supabase du client.

---

## Étape 1 : Exporter depuis l'ancien Supabase

### A. Export du schéma (Structure des tables)

1. Connecte-toi à ton **ancien dashboard Supabase**
2. Va dans **Settings → Database**
3. Clique sur **"Database"** dans le menu latéral
4. Trouve et clique sur **"Connection Pooling"** ou **"Connection String"**
5. Copie l'**URL de connexion** (on en aura besoin)

**OU utilise les fichiers SQL existants** :
- `supabase-portfolio-setup.sql` (tables portfolios et portfolio_slides)
- `supabase-storage-setup.sql` (configuration du storage)

### B. Export des données (Contenu des tables)

**Option 1 : Export manuel via l'interface**

Pour chaque table, va dans **Table Editor** :

1. `homepage` → Clic droit → Export to CSV
2. `citation` → Export to CSV
3. `demarche_observer` → Export to CSV
4. `demarche_dessiner` → Export to CSV
5. `demarche_realiser` → Export to CSV
6. `demarche_accompagner` → Export to CSV
7. `portrait` → Export to CSV
8. `faqs` → Export to CSV
9. `portfolios` → Export to CSV
10. `portfolio_slides` → Export to CSV

Sauvegarde tous les CSV dans un dossier `supabase-export/`.

**Option 2 : Export via SQL**

Va dans **SQL Editor** et exécute le fichier `export-supabase-data.sql` pour chaque table.

### C. Export des images du Storage

1. Va dans **Storage → portfolios**
2. Télécharge toutes les images du bucket `portfolios`
3. Sauvegarde-les dans `supabase-export/images/`

---

## Étape 2 : Créer le nouveau projet Supabase

1. Le client doit créer un compte sur [supabase.com](https://supabase.com)
2. Créer un **nouveau projet** :
   - Nom : `atelier-desnoyers` (ou autre)
   - Database Password : **Note ce mot de passe !**
   - Région : Choisir la plus proche (Europe West par exemple)
3. Attendre la création du projet (~2 minutes)

---

## Étape 3 : Importer le schéma dans le nouveau Supabase

### A. Créer les tables

1. Va dans **SQL Editor** du nouveau Supabase
2. Copie-colle le contenu de `supabase-portfolio-setup.sql`
3. **Exécute** le script
4. Vérifie dans **Table Editor** que toutes les tables sont créées

### B. Configurer le Storage

1. Va dans **SQL Editor**
2. Copie-colle le contenu de `supabase-storage-setup.sql`
3. **Exécute** le script
4. Vérifie dans **Storage** que le bucket `portfolios` existe

---

## Étape 4 : Importer les données

### A. Import via l'interface (recommandé)

Pour chaque table :

1. Va dans **Table Editor → [Nom de la table]**
2. Clique sur **"Insert"** → **"Import data from CSV"**
3. Sélectionne le fichier CSV correspondant
4. **Importe** les données

### B. Vérification

Vérifie dans **Table Editor** que toutes les données sont bien là :
- homepage (1 ligne)
- citation (1 ligne)
- demarche_observer (1 ligne)
- demarche_dessiner (1 ligne)
- demarche_realiser (1 ligne)
- demarche_accompagner (1 ligne)
- portrait (1 ligne)
- faqs (plusieurs lignes)
- portfolios (6 projets)
- portfolio_slides (plusieurs slides par projet)

---

## Étape 5 : Migrer les images du Storage

### A. Upload manuel

1. Va dans **Storage → portfolios**
2. Clique sur **"Upload file"**
3. Sélectionne toutes les images depuis `supabase-export/images/`
4. **Upload** (peut prendre quelques minutes selon le nombre d'images)

### B. Vérifier les URLs

Les URLs des images vont changer !

Ancien format :
```
https://[ancien-projet].supabase.co/storage/v1/object/public/portfolios/image.jpg
```

Nouveau format :
```
https://[nouveau-projet].supabase.co/storage/v1/object/public/portfolios/image.jpg
```

**IMPORTANT** : Si tu as stocké des URLs complètes dans la base de données, il faut les mettre à jour !

---

## Étape 6 : Mettre à jour le projet React

### A. Récupérer les nouvelles clés API

Dans le **nouveau dashboard Supabase** :

1. Va dans **Settings → API**
2. Copie :
   - **Project URL** (ex: `https://abcdefgh.supabase.co`)
   - **anon public** key (commence par `eyJ...`)

### B. Mettre à jour les variables d'environnement

**Créer un fichier `.env.local` à la racine du projet** :

```bash
VITE_SUPABASE_URL=https://[nouveau-projet-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...votre-nouvelle-clé...
```

### C. Mettre à jour sur Infomaniak

Sur le serveur Infomaniak, crée le fichier `.env.production` :

```bash
cd ~/sites/atelier-desnoyers.com
nano .env.production
```

Contenu :
```
VITE_SUPABASE_URL=https://[nouveau-projet-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...votre-nouvelle-clé...
```

### D. Rebuild et redéployer

```bash
# En local
npm run build

# Sur Infomaniak (via SSH)
cd ~/sites/atelier-desnoyers.com
git pull origin main
npm install
npm run build
# Redémarrer le serveur via le panneau d'admin
```

---

## Étape 7 : Tester

1. Ouvre le site : https://atelier-desnoyers.com
2. Vérifie que :
   - ✅ La page d'accueil affiche les bonnes données
   - ✅ Les sections Observer/Dessiner/Réaliser/Accompagner sont remplies
   - ✅ Le portfolio affiche les 6 projets
   - ✅ Les images des projets se chargent correctement
   - ✅ La page admin fonctionne (si applicable)

---

## Checklist finale

- [ ] Toutes les tables sont créées dans le nouveau Supabase
- [ ] Toutes les données sont importées
- [ ] Toutes les images sont dans le Storage
- [ ] Les variables d'environnement sont mises à jour (local + Infomaniak)
- [ ] Le site fonctionne correctement
- [ ] L'ancien Supabase peut être supprimé (attendre quelques jours pour être sûr)

---

## En cas de problème

### Les données ne s'affichent pas

1. Vérifie les variables d'environnement dans `.env.local` et `.env.production`
2. Vérifie la console du navigateur (F12) pour des erreurs
3. Vérifie que les RLS policies sont bien activées (voir `supabase-portfolio-setup.sql`)

### Les images ne se chargent pas

1. Vérifie que le bucket `portfolios` est **public**
2. Vérifie les URLs des images dans la table `portfolio_slides`
3. Vérifie que les images sont bien uploadées dans Storage

### Erreur "JWT expired" ou "Invalid API key"

Les clés API ont changé, vérifie `.env.local` et `.env.production`.

---

## Notes importantes

1. **Ne supprime PAS l'ancien Supabase** avant d'être sûr que tout fonctionne
2. **Garde une sauvegarde** des CSV et images
3. **Teste en local** avant de déployer sur Infomaniak
4. Les **URLs du Storage vont changer**, vérifie si tu as des liens en dur quelque part

---

Bon courage ! 🚀
