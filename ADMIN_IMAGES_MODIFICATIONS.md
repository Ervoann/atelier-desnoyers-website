# Modifications à apporter à AdminPage.tsx pour la gestion des images

## ✅ DÉJÀ FAIT
- Types TypeScript mis à jour dans `useSupabaseData.ts`
- Champ vidéo hero ajouté dans la section Homepage
- Script SQL créé: `supabase-add-images-v0.0.5.sql`

## 📋 À AJOUTER DANS AdminPage.tsx

### 1. Section Citation (après le champ "Sous-texte", ligne ~1332)

```tsx
<div>
  <ImageUploader
    currentImageUrl={citation.imageFondUrl || ''}
    onImageUploaded={(url) => setCitation({ ...citation, imageFondUrl: url })}
    label="Image de fond"
    bucketName="portfolios"
  />
  <div className="mt-2">
    <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
    <input
      type="url"
      value={citation.imageFondUrl || ''}
      onChange={(e) => setCitation({ ...citation, imageFondUrl: e.target.value })}
      readOnly={!isEditing}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      placeholder="https://..."
    />
  </div>
</div>
```

### 2. Section Observer (après les champs de paragraphes et actions, ligne ~1450)

```tsx
<div>
  <ImageUploader
    currentImageUrl={observer.imageUrl || ''}
    onImageUploaded={(url) => setObserver({ ...observer, imageUrl: url })}
    label="Image de la section"
    bucketName="portfolios"
  />
  <div className="mt-2">
    <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
    <input
      type="url"
      value={observer.imageUrl || ''}
      onChange={(e) => setObserver({ ...observer, imageUrl: e.target.value })}
      readOnly={!isEditing}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      placeholder="https://..."
    />
  </div>
</div>
```

### 3. Section Dessiner (après les champs d'aspects, ligne ~1650)

```tsx
<div>
  <ImageUploader
    currentImageUrl={dessiner.imageUrl || ''}
    onImageUploaded={(url) => setDessiner({ ...dessiner, imageUrl: url })}
    label="Image de la section"
    bucketName="portfolios"
  />
  <div className="mt-2">
    <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
    <input
      type="url"
      value={dessiner.imageUrl || ''}
      onChange={(e) => setDessiner({ ...dessiner, imageUrl: e.target.value })}
      readOnly={!isEditing}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      placeholder="https://..."
    />
  </div>
</div>
```

### 4. Section Réaliser (après les champs d'actions, ligne ~1850)

```tsx
<div>
  <ImageUploader
    currentImageUrl={realiser.imageUrl || ''}
    onImageUploaded={(url) => setRealiser({ ...realiser, imageUrl: url })}
    label="Image de la section"
    bucketName="portfolios"
  />
  <div className="mt-2">
    <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
    <input
      type="url"
      value={realiser.imageUrl || ''}
      onChange={(e) => setRealiser({ ...realiser, imageUrl: e.target.value })}
      readOnly={!isEditing}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      placeholder="https://..."
    />
  </div>
</div>
```

### 5. Section Accompagner (après les champs d'offres, ligne ~2000)

```tsx
<div>
  <ImageUploader
    currentImageUrl={accompagner.imageUrl || ''}
    onImageUploaded={(url) => setAccompagner({ ...accompagner, imageUrl: url })}
    label="Image de la section"
    bucketName="portfolios"
  />
  <div className="mt-2">
    <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
    <input
      type="url"
      value={accompagner.imageUrl || ''}
      onChange={(e) => setAccompagner({ ...accompagner, imageUrl: e.target.value })}
      readOnly={!isEditing}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      placeholder="https://..."
    />
  </div>
</div>
```

### 6. Section Portrait (après les 3 paragraphes, ligne ~1950)

```tsx
<div className="space-y-4">
  <h3 className="text-md font-semibold text-gray-800">Images du portrait</h3>

  <div>
    <ImageUploader
      currentImageUrl={portrait.image1Url || ''}
      onImageUploaded={(url) => setPortrait({ ...portrait, image1Url: url })}
      label="Image 1 (paragraphe 1 - droite)"
      bucketName="portfolios"
    />
    <div className="mt-2">
      <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
      <input
        type="url"
        value={portrait.image1Url || ''}
        onChange={(e) => setPortrait({ ...portrait, image1Url: e.target.value })}
        readOnly={!isEditing}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        placeholder="https://..."
      />
    </div>
  </div>

  <div>
    <ImageUploader
      currentImageUrl={portrait.image2Url || ''}
      onImageUploaded={(url) => setPortrait({ ...portrait, image2Url: url })}
      label="Image 2 (paragraphe 2 - gauche)"
      bucketName="portfolios"
    />
    <div className="mt-2">
      <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
      <input
        type="url"
        value={portrait.image2Url || ''}
        onChange={(e) => setPortrait({ ...portrait, image2Url: e.target.value })}
        readOnly={!isEditing}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        placeholder="https://..."
      />
    </div>
  </div>

  <div>
    <ImageUploader
      currentImageUrl={portrait.image3Url || ''}
      onImageUploaded={(url) => setPortrait({ ...portrait, image3Url: url })}
      label="Image 3 (paragraphe 3 - droite)"
      bucketName="portfolios"
    />
    <div className="mt-2">
      <label className="block text-xs text-gray-500 mb-1">Ou entrez une URL directement :</label>
      <input
        type="url"
        value={portrait.image3Url || ''}
        onChange=(e) => setPortrait({ ...portrait, image3Url: e.target.value })}
        readOnly={!isEditing}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        placeholder="https://..."
      />
    </div>
  </div>
</div>
```

## 🔄 MODIFICATIONS FRONTEND (Home.tsx)

Les images seront maintenant chargées depuis Supabase au lieu des URLs en dur. Voici les modifications à faire:

### HeroVideo (ligne ~821)
```tsx
function HeroVideo({ videoUrl }: { videoUrl?: string }) {
  if (!videoUrl) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
      <iframe
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          scale: "1.5",
          width: "100vw",
          height: "56.25vw",
          minHeight: "100vh",
          minWidth: "177.77vh",
          pointerEvents: 'none'
        }}
        src={videoUrl}
        title="Background video"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="eager"
      />
    </div>
  );
}
```

Et dans le Hero, remplacer:
```tsx
<HeroVideo />
```
par:
```tsx
<HeroVideo videoUrl={homepage?.heroVideoUrl} />
```

### Section Citation (ligne ~668)
Remplacer l'URL en dur par:
```tsx
<img
  src={citation?.imageFondUrl || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&h=1080&fit=crop&auto=format&q=80'}
  alt="Jardin paysager naturel"
  ...
/>
```

### Sections Démarche
Similaire pour Observer (ligne ~180), Dessiner (ligne ~255), Réaliser (ligne ~481), Accompagner (ligne ~552):
```tsx
src={observer?.imageUrl || 'URL_PAR_DEFAUT'}
src={dessiner?.imageUrl || 'URL_PAR_DEFAUT'}
src={realiser?.imageUrl || 'URL_PAR_DEFAUT'}
src={accompagner?.imageUrl || 'URL_PAR_DEFAUT'}
```

### Section Portrait (lignes ~1216, ~1235, ~1275)
```tsx
// Image 1
src={portrait?.image1Url || 'https://images.unsplash.com/photo-1680176104120-9dba9c415e89?w=1200&h=900&fit=crop&auto=format'}

// Image 2
src={portrait?.image2Url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=900&fit=crop&auto=format'}

// Image 3
src={portrait?.image3Url || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=900&fit=crop&auto=format'}
```

## 📝 INSTRUCTIONS

1. Exécuter le script SQL dans Supabase: `supabase-add-images-v0.0.5.sql`
2. Ajouter les champs dans AdminPage.tsx (sections ci-dessus)
3. Modifier Home.tsx pour utiliser les URLs depuis Supabase
4. Build et test

C'est beaucoup de modifications mais elles suivent toutes le même pattern!
