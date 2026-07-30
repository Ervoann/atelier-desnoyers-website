# Déploiement sur Infomaniak - Atelier Desnoyers

Guide pas-à-pas pour déployer ton site sur Infomaniak.

---

## Informations importantes

- **Domaine** : `atelier-desnoyers.com`
- **Site** : `https://atelier-desnoyers.com`
- **Admin Strapi** : `https://atelier-desnoyers.com/admin`
- **API Strapi** : `https://atelier-desnoyers.com/api`
- **Base de données** : Supabase PostgreSQL (déjà configurée)

---

## Étape 1 : Vérifier ton hébergement Infomaniak

### Questions à vérifier :

1. **As-tu un hébergement Node.js chez Infomaniak ?**
   - Si non, commander : https://www.infomaniak.com/fr/hebergement/serveur-cloud
   - Il te faut un Cloud Server ou un hébergement avec Node.js

2. **Le domaine pointe-t-il vers ton hébergement ?**
   - Va dans ton Manager Infomaniak
   - Vérifie que `atelier-desnoyers.com` est bien configuré

3. **As-tu l'accès SSH ?**
   - Dans le Manager > ton hébergement > SSH/SFTP
   - Note les identifiants SSH

---

## Étape 2 : Se connecter en SSH

Ouvre ton terminal et connecte-toi à ton serveur :

```bash
ssh ton-username@atelier-desnoyers.com
```

Ou si Infomaniak t'a fourni une autre adresse :

```bash
ssh ton-username@ssh.ton-serveur.infomaniak.com
```

Entre ton mot de passe SSH quand demandé.

---

## Étape 3 : Préparer le serveur

Une fois connecté en SSH, crée un dossier pour ton site :

```bash
# Aller dans le dossier racine du site
cd ~

# Créer le dossier pour l'application
mkdir -p atelier-desnoyers
cd atelier-desnoyers
```

---

## Étape 4 : Uploader les fichiers

### Option A : Avec SFTP (Recommandé pour débuter)

1. **Utilise un client SFTP** comme FileZilla ou Cyberduck
2. **Connexion SFTP** :
   - Hôte : `atelier-desnoyers.com` (ou l'adresse fournie par Infomaniak)
   - Username : ton username SSH
   - Password : ton mot de passe SSH
   - Port : 22

3. **Upload ces dossiers/fichiers** :
   ```
   dist/               (site React compilé)
   strapi/             (tout le dossier)
   server.js           (serveur Node.js)
   package.json
   package-lock.json
   .env.server         (à renommer en .env après upload)
   ```

### Option B : Avec Git (Si tu préfères)

Sur le serveur :

```bash
# Cloner ton dépôt Git (si tu en as créé un)
git clone https://github.com/ton-username/SiteAtelierDesnoyers.git .

# Ou uploader manuellement avec scp depuis ton Mac
# Dans un nouveau terminal (pas le SSH) :
cd /Users/ervoann/DocumentsLocal/1_P_PROJECTS
scp -r SiteAtelierDesnoyers ton-username@atelier-desnoyers.com:~/atelier-desnoyers
```

---

## Étape 5 : Configurer l'environnement

Sur le serveur SSH :

```bash
# Renommer .env.server en .env
mv .env.server .env

# Copier aussi dans le dossier strapi
cp .env strapi/.env

# Vérifier que le fichier existe
ls -la .env
```

---

## Étape 6 : Installer les dépendances

```bash
# Vérifier la version de Node.js (doit être >= 18)
node --version

# Si Node.js n'est pas installé ou version trop ancienne, installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Installer les dépendances principales
npm install --production

# Installer les dépendances de Strapi
cd strapi
npm install --production
cd ..
```

---

## Étape 7 : Installer PM2

PM2 va gérer ton application Node.js et la redémarrer automatiquement :

```bash
# Installer PM2 globalement
npm install -g pm2

# Vérifier l'installation
pm2 --version
```

---

## Étape 8 : Démarrer l'application

```bash
# Démarrer l'application avec PM2
pm2 start npm --name "atelier-desnoyers" -- start

# Vérifier que ça tourne
pm2 status

# Voir les logs en temps réel
pm2 logs atelier-desnoyers

# Si tout est OK, sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique au reboot
pm2 startup
# Copie-colle la commande qui s'affiche et exécute-la
```

---

## Étape 9 : Configurer le reverse proxy Infomaniak

### Dans le Manager Infomaniak :

1. **Aller dans "Sites & Domaines"**
2. **Sélectionner** `atelier-desnoyers.com`
3. **Configuration du reverse proxy** :
   - Chercher l'option "Reverse Proxy" ou "Node.js"
   - Configurer :
     - **URL externe** : `https://atelier-desnoyers.com`
     - **URL interne** : `http://localhost:3000`
     - **Port** : 3000

4. **Activer HTTPS** :
   - Chercher "SSL/TLS" ou "Let's Encrypt"
   - Activer le certificat SSL gratuit

---

## Étape 10 : Tester le site

Ouvre ton navigateur et vérifie :

1. **Site principal** : https://atelier-desnoyers.com
   - Tu dois voir ton site React

2. **Admin Strapi** : https://atelier-desnoyers.com/admin
   - Tu dois pouvoir te connecter avec ton compte admin

3. **API** : https://atelier-desnoyers.com/api/test-texts
   - Tu dois voir les données JSON

---

## Commandes utiles PM2

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs atelier-desnoyers

# Redémarrer
pm2 restart atelier-desnoyers

# Arrêter
pm2 stop atelier-desnoyers

# Supprimer
pm2 delete atelier-desnoyers
```

---

## Mise à jour du site

Quand tu modifies ton site en local :

```bash
# 1. Sur ton Mac : recompiler
npm run build

# 2. Uploader les nouveaux fichiers via SFTP
# Ou avec scp :
scp -r dist ton-username@atelier-desnoyers.com:~/atelier-desnoyers/
scp -r strapi/dist ton-username@atelier-desnoyers.com:~/atelier-desnoyers/strapi/

# 3. Sur le serveur SSH : redémarrer PM2
pm2 restart atelier-desnoyers
```

---

## Dépannage

### Le site ne se charge pas

```bash
# Vérifier que l'app tourne
pm2 status

# Voir les logs d'erreur
pm2 logs atelier-desnoyers --err

# Vérifier que le port 3000 est utilisé
lsof -i :3000
```

### Erreur 502 Bad Gateway

- Le reverse proxy ne trouve pas l'application
- Vérifier que PM2 tourne : `pm2 status`
- Vérifier la config du reverse proxy dans le Manager Infomaniak

### Erreur de connexion à la base de données

```bash
# Vérifier que les variables d'environnement sont correctes
cat .env | grep DATABASE

# Tester la connexion Supabase
cd strapi
npm run strapi -- services:list
```

---

## Support

- **Documentation Infomaniak** : https://www.infomaniak.com/fr/support
- **Documentation Strapi** : https://strapi.io/documentation
- **Support Supabase** : https://supabase.com/docs

---

## Checklist finale

- [ ] Hébergement Node.js Infomaniak commandé
- [ ] Accès SSH configuré
- [ ] Domaine `atelier-desnoyers.com` configuré
- [ ] Fichiers uploadés sur le serveur
- [ ] Fichier `.env` créé avec les bonnes clés
- [ ] Dépendances npm installées
- [ ] PM2 installé et configuré
- [ ] Application démarrée avec PM2
- [ ] Reverse proxy configuré dans Manager Infomaniak
- [ ] HTTPS activé (Let's Encrypt)
- [ ] Site accessible sur https://atelier-desnoyers.com
- [ ] Admin Strapi accessible sur https://atelier-desnoyers.com/admin
