# Checklist de mise en production

Suivez ces étapes dans l'ordre pour mettre en ligne le site avec le CMS.

## ✅ Étape 0 : Installer les dépendances

- [ ] Ouvrez un terminal dans le dossier du projet
- [ ] Exécutez : `pnpm install` (ou `npm install`)
- [ ] Attendez que l'installation se termine

## ✅ Étape 1 : Créer le repository GitHub

- [ ] Allez sur https://github.com/new
- [ ] Nom du repo : `SiteAtelierDesnoyers`
- [ ] Visibilité : **Private** (pour la sécurité)
- [ ] NE PAS cocher "Initialize with README"
- [ ] Notez votre username GitHub : `_______________`

## ✅ Étape 2 : Mettre à jour la configuration

- [ ] Ouvrez `public/admin/config.yml`
- [ ] Ligne 3 : Remplacez `VOTRE-USERNAME/SiteAtelierDesnoyers` par votre vraie URL
- [ ] Sauvegardez le fichier

## ✅ Étape 3 : Pousser le code sur GitHub

Remplacez `VOTRE-USERNAME` par votre username GitHub :

```bash
git remote add origin https://github.com/VOTRE-USERNAME/SiteAtelierDesnoyers.git
git add .
git commit -m "Configuration initiale avec DecapCMS"
git push -u origin main
```

- [ ] Code poussé sur GitHub avec succès

## ✅ Étape 4 : Créer l'OAuth App GitHub

- [ ] Allez sur https://github.com/settings/developers
- [ ] Cliquez sur **New OAuth App**
- [ ] Application name : `Atelier Desnoyers CMS`
- [ ] Homepage URL : `https://votre-site-infomaniak.com`
- [ ] Authorization callback URL : `https://api.netlify.com/auth/done`
- [ ] Notez le **Client ID** : `_______________`
- [ ] Générez et notez le **Client Secret** : `_______________`

## ✅ Étape 5 : Configurer Netlify (authentification gratuite)

- [ ] Créez un compte sur https://app.netlify.com (gratuit)
- [ ] Allez sur **Sites** > **Add new site** > **Import an existing project**
- [ ] Connectez votre repo GitHub
- [ ] Déployez le site sur Netlify (juste pour l'auth, pas l'hébergement)
- [ ] Allez dans **Site settings** > **Access control** > **OAuth**
- [ ] Cliquez sur **Install provider**
- [ ] Choisissez **GitHub**
- [ ] Entrez le Client ID et Client Secret
- [ ] Sauvegardez

**Alternative sans Netlify** : Utilisez GitHub Backend avec authentification directe
- Modifiez `public/admin/config.yml` :
  ```yaml
  backend:
    name: github
    repo: VOTRE-USERNAME/SiteAtelierDesnoyers
    branch: main
  ```
- Les utilisateurs se connecteront directement avec GitHub (nécessite droits d'écriture sur le repo)

## ✅ Étape 6 : Récupérer les infos FTP Infomaniak

- [ ] Connectez-vous à Infomaniak
- [ ] Allez dans **Hébergement Web**
- [ ] Notez :
  - Serveur FTP : `_______________`
  - Username : `_______________`
  - Password : `_______________`
  - Répertoire : `/web` ou `/public_html` ?

## ✅ Étape 7 : Configurer les secrets GitHub

- [ ] Allez sur `https://github.com/VOTRE-USERNAME/SiteAtelierDesnoyers/settings/secrets/actions`
- [ ] Cliquez sur **New repository secret**
- [ ] Ajoutez :
  - **FTP_SERVER** : votre serveur FTP
  - **FTP_USERNAME** : votre username FTP
  - **FTP_PASSWORD** : votre password FTP

## ✅ Étape 8 : Ajuster le répertoire de déploiement

- [ ] Ouvrez `.github/workflows/deploy.yml`
- [ ] Ligne 33, modifiez `server-dir: /` par :
  - `/web` ou
  - `/public_html` ou
  - le chemin donné par Infomaniak
- [ ] Commit et push :
  ```bash
  git add .
  git commit -m "Configuration FTP Infomaniak"
  git push
  ```

## ✅ Étape 9 : Tester le déploiement

- [ ] Allez sur GitHub > **Actions**
- [ ] Vérifiez que le workflow "Build and Deploy to Infomaniak" se lance
- [ ] Attendez qu'il soit vert (✓)
- [ ] Allez sur votre site Infomaniak
- [ ] Vérifiez que le site s'affiche

## ✅ Étape 10 : Tester le CMS

- [ ] Allez sur `https://votre-site-infomaniak.com/admin`
- [ ] Cliquez sur **Login with GitHub**
- [ ] Autorisez l'application
- [ ] Vérifiez que vous voyez l'interface DecapCMS
- [ ] Testez la modification d'un paramètre
- [ ] Vérifiez que le changement apparaît sur GitHub (nouveau commit)
- [ ] Attendez 2-5 minutes
- [ ] Vérifiez que le site est mis à jour sur Infomaniak

## ✅ Étape 11 : Donner accès au client

Pour que le client puisse se connecter au CMS :

- [ ] Le client doit créer un compte GitHub (gratuit)
- [ ] Ajoutez-le comme collaborateur sur le repo :
  - `https://github.com/VOTRE-USERNAME/SiteAtelierDesnoyers/settings/access`
  - **Add people** > Entrez son username GitHub > **Add**
- [ ] Donnez-lui l'URL : `https://votre-site-infomaniak.com/admin`
- [ ] Envoyez-lui le fichier `GUIDE_CLIENT.md`

---

## 🚨 En cas de problème

### Le site ne se déploie pas
1. Vérifiez les logs dans GitHub Actions
2. Vérifiez les secrets FTP
3. Vérifiez les permissions du dossier sur Infomaniak

### Le CMS ne se connecte pas
1. Vérifiez l'OAuth App GitHub
2. Vérifiez la configuration Netlify
3. Vérifiez `public/admin/config.yml`

### Les images ne s'affichent pas
1. Vérifiez que le dossier `public/uploads` est bien déployé
2. Vérifiez les permissions sur Infomaniak
3. Vérifiez les chemins dans les fichiers JSON

---

## 📝 Notes

Votre username GitHub : `_______________`
URL du site : `_______________`
Date de mise en prod : `_______________`
