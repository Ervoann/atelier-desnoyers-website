# Site Atelier Desnoyers

Site web avec back-office DecapCMS et déploiement automatique sur Infomaniak.

## Documentation

- **[CHECKLIST.md](CHECKLIST.md)** - Liste complète des étapes de mise en production
- **[SETUP.md](SETUP.md)** - Guide technique détaillé
- **[GUIDE_CLIENT.md](GUIDE_CLIENT.md)** - Guide d'utilisation pour le client

## Architecture

```
Client → DecapCMS (/admin) → GitHub (privé) → GitHub Actions → Infomaniak (FTP)
```

## Développement local

```bash
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

Le CMS sera accessible sur `http://localhost:5173/admin`

## Build de production

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`

## Déploiement

Le déploiement est automatique via GitHub Actions :
1. Commit et push sur la branche `main`
2. GitHub Actions build le projet
3. Déploiement automatique sur Infomaniak via FTP

## Structure du contenu

```
public/
├── admin/              # Interface DecapCMS
├── content/
│   ├── settings/       # Paramètres du site (JSON)
│   └── blog/           # Articles de blog (Markdown)
└── uploads/            # Images uploadées via le CMS
```

## Accès au CMS

URL : `https://votre-site.com/admin`

L'authentification se fait via GitHub OAuth. Seuls les collaborateurs du repo GitHub peuvent se connecter.
