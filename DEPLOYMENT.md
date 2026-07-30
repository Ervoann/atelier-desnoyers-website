# Guide de Déploiement - Atelier Desnoyers

Ce guide explique comment déployer le site Atelier Desnoyers sur Infomaniak avec Node.js.

## Architecture

- **Site React** (fichiers statiques compilés) servi sur `https://atelier-desnoyers.com`
- **Admin Strapi** accessible sur `https://atelier-desnoyers.com/admin`
- **API Strapi** accessible sur `https://atelier-desnoyers.com/api`
- **Base de données PostgreSQL** hébergée sur Supabase (gratuit)

---

## Prérequis Infomaniak

1. **Hébergement Node.js** chez Infomaniak
   - Commander un hébergement Node.js si ce n'est pas déjà fait
   - Accéder au Manager Infomaniak

2. **Accès SSH** activé
   - Dans le Manager > votre hébergement > SSH/SFTP
   - Noter les identifiants SSH

3. **Nom de domaine configuré**
   - `atelier-desnoyers.com` doit pointer vers votre hébergement

---

## Étape 1 : Préparer les variables d'environnement

### Générer les secrets Strapi

**IMPORTANT** : Avant le déploiement, il faut générer de vraies clés secrètes pour Strapi.

Exécute cette commande pour générer des clés aléatoires :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Exécute cette commande **5 fois** pour générer :
- `APP_KEYS` (2 clés séparées par une virgule)
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`

### Mettre à jour `.env.production`

Édite le fichier `.env.production` avec les vraies valeurs :

```env
PUBLIC_URL=https://atelier-desnoyers.com

# Strapi Configuration
NODE_ENV=production
HOST=0.0.0.0
PORT=3000

# Database - PostgreSQL (Supabase)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:VClT3LaldYII1hVDT%24S1OYRM8VO%40Ehae@db.nhkcjytfmwpgetdmzxut.supabase.co:5432/postgres?sslmode=no-verify
DATABASE_HOST=db.nhkcjytfmwpgetdmzxut.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=VClT3LaldYII1hVDT$S1OYRM8VO@Ehae
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
DATABASE_SCHEMA=public

# Secrets - REMPLACE AVEC TES VRAIES CLÉS GÉNÉRÉES !
APP_KEYS=clé1_base64,clé2_base64
API_TOKEN_SALT=clé3_base64
ADMIN_JWT_SECRET=clé4_base64
TRANSFER_TOKEN_SALT=clé5_base64
JWT_SECRET=clé6_base64
```

---

## Étape 2 : Compiler le projet en local

Avant d'envoyer sur le serveur, compile tout en local :

```bash
# Compile React + Strapi
npm run build
```

Cela va créer :
- `dist/` : Site React compilé
- `strapi/dist/` : Admin Strapi compilé

---

## Étape 3 : Déployer sur Infomaniak

### Connexion SSH

```bash
ssh ton-username@atelier-desnoyers.com
```

### Créer la structure

```bash
# Se placer dans le dossier web
cd ~

# Créer le dossier pour le site
mkdir -p atelier-desnoyers
cd atelier-desnoyers
```

### Uploader les fichiers

**Option A : Avec SFTP (FileZilla, Cyberduck, etc.)**

Envoie ces dossiers/fichiers sur le serveur :
- `dist/` (site React compilé)
- `strapi/` (tout le dossier Strapi)
- `server.js` (serveur Node.js)
- `package.json`
- `package-lock.json`
- `.env.production` (renommer en `.env` sur le serveur)

**Option B : Avec Git (recommandé)**

```bash
# Sur le serveur
git clone https://github.com/ton-username/SiteAtelierDesnoyers.git .
```

---

## Étape 4 : Installer les dépendances

Sur le serveur, dans le dossier du projet :

```bash
# Installer les dépendances principales
npm install --production

# Installer les dépendances de Strapi
cd strapi
npm install --production
cd ..
```

---

## Étape 5 : Configurer les variables d'environnement

```bash
# Renommer le fichier d'environnement
mv .env.production .env

# Copier aussi dans le dossier strapi
cp .env strapi/.env
```

---

## Étape 6 : Démarrer le serveur

### Option A : Avec PM2 (recommandé pour production)

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start npm --name "atelier-desnoyers" -- start

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer automatiquement
pm2 startup
```

### Option B : Avec Node directement

```bash
NODE_ENV=production node server.js
```

---

## Étape 7 : Configurer le domaine et HTTPS

### Dans le Manager Infomaniak

1. Aller dans **Sites & Domaines**
2. Sélectionner `atelier-desnoyers.com`
3. Configurer le **Reverse Proxy** :
   - URL : `https://atelier-desnoyers.com`
   - Target : `http://localhost:3000`
4. Activer **HTTPS automatique** (Let's Encrypt)

---

## Étape 8 : Vérifier le déploiement

Ouvre ton navigateur et vérifie :

1. **Site principal** : `https://atelier-desnoyers.com`
2. **Admin Strapi** : `https://atelier-desnoyers.com/admin`
3. **API Strapi** : `https://atelier-desnoyers.com/api/test-texts`

---

## Commandes utiles PM2

```bash
# Voir les logs en temps réel
pm2 logs atelier-desnoyers

# Redémarrer l'application
pm2 restart atelier-desnoyers

# Arrêter l'application
pm2 stop atelier-desnoyers

# Supprimer l'application
pm2 delete atelier-desnoyers

# Voir le statut
pm2 status
```

---

## Mise à jour du site

Pour mettre à jour le site après des modifications :

```bash
# En local : recompiler
npm run build

# Envoyer les nouveaux fichiers sur le serveur (SFTP/Git)

# Sur le serveur : redémarrer
pm2 restart atelier-desnoyers
```

---

## Dépannage

### Le site ne se charge pas

1. Vérifier que le serveur tourne :
   ```bash
   pm2 status
   pm2 logs atelier-desnoyers
   ```

2. Vérifier le port :
   ```bash
   lsof -i :3000
   ```

### Erreur de base de données

1. Vérifier la connexion Supabase :
   ```bash
   cd strapi
   npm run strapi -- services:list
   ```

2. Vérifier les variables d'environnement :
   ```bash
   cat .env | grep DATABASE
   ```

### Erreur 502 Bad Gateway

Le reverse proxy ne trouve pas l'application Node.js :
- Vérifier que le serveur est bien démarré sur le port 3000
- Vérifier la configuration du reverse proxy dans Infomaniak

---

## Support

Pour toute question :
- Documentation Strapi : https://strapi.io/documentation
- Support Infomaniak : https://www.infomaniak.com/fr/support
- Supabase Docs : https://supabase.com/docs
