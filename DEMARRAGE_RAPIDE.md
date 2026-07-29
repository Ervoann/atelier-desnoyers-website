# Démarrage rapide

## Ce que vous avez

✅ Un site web React + Vite
✅ Un CMS back-office (DecapCMS) pour gérer le contenu
✅ Un système de déploiement automatique vers Infomaniak

## Ce qu'il vous faut

1. **Un compte GitHub** (gratuit)
2. **Un hébergement Infomaniak** avec accès FTP
3. **10-15 minutes** pour la configuration

## Étapes ultra-rapides

### 1️⃣ Créer le repo GitHub

```bash
# Sur GitHub.com, créez un nouveau repo PRIVÉ nommé "SiteAtelierDesnoyers"
# Puis dans votre terminal :

git remote add origin https://github.com/VOTRE-USERNAME/SiteAtelierDesnoyers.git
git add .
git commit -m "Initial setup"
git push -u origin main
```

### 2️⃣ Modifier la config DecapCMS

Ouvrez `public/admin/config.yml` et changez la ligne 3 :
```yaml
repo: VOTRE-VRAI-USERNAME/SiteAtelierDesnoyers
```

### 3️⃣ Configurer GitHub OAuth

1. https://github.com/settings/developers → **New OAuth App**
2. Homepage : `https://votre-site.com`
3. Callback : `https://api.netlify.com/auth/done`
4. Notez Client ID + Secret

### 4️⃣ Setup Netlify (gratuit, juste pour l'auth)

1. https://app.netlify.com → Importez votre repo
2. **Site settings** > **OAuth** > **GitHub**
3. Collez Client ID + Secret

### 5️⃣ Configurer le FTP Infomaniak

Sur GitHub, allez dans votre repo :
**Settings** > **Secrets** > **Actions** > **New secret**

Ajoutez ces 3 secrets :
- `FTP_SERVER` = votre serveur FTP Infomaniak
- `FTP_USERNAME` = votre username FTP
- `FTP_PASSWORD` = votre mot de passe FTP

### 6️⃣ Ajuster le chemin FTP

Dans `.github/workflows/deploy.yml` ligne 33 :
```yaml
server-dir: /web  # ou /public_html (selon Infomaniak)
```

### 7️⃣ Push et déployer !

```bash
git add .
git commit -m "Configuration FTP"
git push
```

Allez sur **GitHub Actions** et regardez le déploiement se faire ! 🚀

---

## Tester le CMS

Une fois déployé, allez sur :
`https://votre-site.com/admin`

Connectez-vous avec GitHub et testez !

---

## Questions ?

Consultez la **[CHECKLIST.md](CHECKLIST.md)** détaillée ou le **[SETUP.md](SETUP.md)** complet.
