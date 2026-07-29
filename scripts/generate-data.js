import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioDir = path.join(__dirname, '../public/content/portfolio');
const outputFile = path.join(__dirname, '../src/app/data-generated.ts');

// Lire tous les fichiers JSON du portfolio
function loadPortfolioProjects() {
  if (!fs.existsSync(portfolioDir)) {
    console.log('Dossier portfolio non trouvé, utilisation des données par défaut');
    return [];
  }

  const files = fs.readdirSync(portfolioDir).filter(f => f.endsWith('.json'));

  const projects = files.map((file, index) => {
    const content = fs.readFileSync(path.join(portfolioDir, file), 'utf-8');
    const project = JSON.parse(content);

    // Convertir le format CMS vers le format attendu par le code
    return {
      id: index + 1,
      slug: project.slug,
      titre: project.titre,
      lieu: project.lieu,
      type: project.type,
      annee: project.annee,
      surface: project.surface,
      img: project.img,
      slides: project.slides.map(slide => ({
        type: slide.type,
        ...(slide.type === 'youtube' ? { videoId: slide.src } : { src: slide.src })
      })),
      description: project.description,
      tags: project.tags || []
    };
  });

  return projects;
}

// Générer le fichier TypeScript
function generateDataFile() {
  const projects = loadPortfolioProjects();

  const content = `// Ce fichier est généré automatiquement depuis les JSON du CMS
// Ne le modifiez pas manuellement !

export type Slide =
  | { type: "image"; src: string }
  | { type: "youtube"; videoId: string };

export const portfolio = ${JSON.stringify(projects, null, 2)};

// TODO: Générer aussi les autres données (FAQ, accompagnements, articles) depuis le CMS
export const faq = [];
export const accompagnements = [];
export const articles = [];
`;

  fs.writeFileSync(outputFile, content, 'utf-8');
  console.log(`✅ Fichier généré : ${outputFile}`);
  console.log(`📦 ${projects.length} projets chargés depuis le CMS`);
}

generateDataFile();
