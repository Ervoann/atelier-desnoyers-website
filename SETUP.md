# Configuration du Site Atelier Desnoyers

Ce guide vous explique comment configurer le site avec DecapCMS et le déploiement automatique sur Infomaniak.

## Architecture du projet

```
Client → DecapCMS → GitHub Repository → GitHub Actions → Infomaniak (FTP)
```

1. Le client se connecte au back-office via `/admin`
2. Les modifications sont enregistrées dans le repo GitHub
3. GitHub Actions détecte les changements et déclenche un build
4. Le site est déployé automatiquement sur Infomaniak via FTP

---

## Étape 1 : Créer le repository GitHub

1. Allez sur https://github.com/new
2. Créez un nouveau repository :
   - **Nom** : `SiteAtelierDesnoyers` (ou un autre nom)
   - **Visibilité** : **Private** (recommandé pour la sécurité)
   - **NE PAS** cocher "Initialize with README"
3. Une fois créé, notez l'URL du repo : `https://github.com/VOTRE-USERNAME/SiteAtelierDesnoyers`

**Note** : Avec un repo privé, seules les personnes que vous ajoutez comme collaborateurs pourront accéder au CMS.

### Pousser le code vers GitHub

Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub :

```bash
git remote add origin https://github.com/VOTRE-USERNAME/SiteAtelierDesnoyers.git
git add .
git commit -m "Configuration initiale avec DecapCMS"
git push -u origin main
```

---

## Étape 2 : Configurer DecapCMS

### 2.1 Mettre à jour config.yml

Éditez le fichier `public/admin/config.yml` et remplacez :

```yaml
backend:
  name: github
  repo: VOTRE-USERNAME/SiteAtelierDesnoyers  # ← Remplacez ici
```

### 2.2 Configurer l'authentification GitHub OAuth

Pour permettre à DecapCMS de se connecter à GitHub, vous devez créer une OAuth App :

1. Allez sur : https://github.com/settings/developers
2. Cliquez sur "New OAuth App"
3. Remplissez :
   - **Application name** : Atelier Desnoyers CMS
   - **Homepage URL** : `https://votre-site-infomaniak.com`
   - **Authorization callback URL** : `https://api.netlify.com/auth/done`
4. Créez l'app et notez le **Client ID** et **Client Secret**

### 2.3 Configurer Netlify pour l'authentification

DecapCMS utilise le service d'authentification de Netlify (gratuit) :

1. Créez un compte sur https://netlify.com (gratuit)
2. Allez dans **Site settings** > **Access control** > **OAuth**
3. Sous **Authentication providers**, cliquez sur **Install provider**
4. Choisissez **GitHub** et entrez le Client ID et Client Secret
5. Netlify vous donnera une URL de callback à utiliser

**Note** : Vous n'avez pas besoin d'héberger le site sur Netlify, on utilise juste leur service d'authentification gratuit.

---

## Étape 3 : Configurer le déploiement Infomaniak

### 3.1 Récupérer les informations FTP Infomaniak

1. Connectez-vous à votre compte Infomaniak
2. Allez dans **Hébergement Web**
3. Notez les informations FTP :
   - **Serveur FTP** : `ftp.votre-domaine.com` ou IP
   - **Nom d'utilisateur FTP**
   - **Mot de passe FTP**
   - **Répertoire** : généralement `/web` ou `/public_html`

### 3.2 Ajouter les secrets GitHub

1. Allez sur votre repo GitHub
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret** et ajoutez :

   - **FTP_SERVER** : `ftp.votre-domaine.com`
   - **FTP_USERNAME** : votre nom d'utilisateur FTP
   - **FTP_PASSWORD** : votre mot de passe FTP

### 3.3 Ajuster le répertoire de déploiement

Éditez `.github/workflows/deploy.yml` et modifiez la ligne `server-dir` si nécessaire :

```yaml
server-dir: /web  # ou /public_html selon votre configuration Infomaniak
```

---

## Étape 4 : Tester le déploiement

1. Faites un commit et push :
   ```bash
   git add .
   git commit -m "Configuration finale"
   git push
   ```

2. Allez sur GitHub > **Actions** pour voir le workflow en cours
3. Une fois terminé, vérifiez votre site sur Infomaniak

---

## Utilisation du CMS pour le client

### Accéder au back-office

1. Allez sur : `https://votre-site-infomaniak.com/admin`
2. Cliquez sur **Login with GitHub**
3. Autorisez l'application

### Gérer le contenu

#### Paramètres du site
- **Paramètres du site** > **Page d'accueil** : Modifier le titre, l'image de bannière, les sections
- **Paramètres du site** > **Paramètres généraux** : Contact, réseaux sociaux

#### Articles de blog
1. Cliquez sur **Articles de blog**
2. Cliquez sur **New Article de blog**
3. Remplissez les champs :
   - Titre
   - Date de publication
   - Image de couverture (upload direct)
   - Contenu (éditeur Markdown)
4. Cliquez sur **Publish** > **Publish now**

### Workflow de publication

1. Le client modifie le contenu via `/admin`
2. Quand il clique sur **Publish**, DecapCMS créé un commit sur GitHub
3. GitHub Actions détecte le commit et lance le build
4. Le site mis à jour est déployé automatiquement sur Infomaniak (2-5 minutes)

---

## Structure des fichiers de contenu

```
public/
├── content/
│   ├── settings/
│   │   ├── homepage.json     # Paramètres page d'accueil
│   │   └── general.json      # Paramètres généraux
│   └── blog/
│       └── 2026-07-29-bienvenue.md  # Articles (format Markdown avec front matter)
└── uploads/                  # Images uploadées via le CMS
```

---

## Maintenance

### Mettre à jour les dépendances

```bash
pnpm update
```

### Sauvegardes

Le contenu est automatiquement sauvegardé dans le repo GitHub. Pour une sauvegarde supplémentaire :

```bash
git clone https://github.com/VOTRE-USERNAME/SiteAtelierDesnoyers.git backup-$(date +%Y%m%d)
```

### Problèmes courants

**Le CMS ne se connecte pas**
- Vérifiez que l'OAuth App GitHub est bien configurée
- Vérifiez l'URL de callback dans Netlify

**Le déploiement échoue**
- Vérifiez les secrets FTP dans GitHub
- Consultez les logs dans **Actions** sur GitHub

**Les images ne s'affichent pas**
- Vérifiez que le dossier `public/uploads` existe
- Vérifiez les permissions FTP sur Infomaniak

---

## Support

Pour toute question, contactez le développeur du site.
