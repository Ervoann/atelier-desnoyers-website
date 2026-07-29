import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioDir = path.join(__dirname, '../public/content/portfolio');
const outputFile = path.join(__dirname, '../src/app/data-generated.ts');

// Lire tous les fichiers du portfolio (JSON et MD)
function loadPortfolioProjects() {
  if (!fs.existsSync(portfolioDir)) {
    console.log('Dossier portfolio non trouvé, utilisation des données par défaut');
    return [];
  }

  const files = fs.readdirSync(portfolioDir).filter(f => f.endsWith('.json') || f.endsWith('.md'));

  const projects = files.map((file, index) => {
    const content = fs.readFileSync(path.join(portfolioDir, file), 'utf-8');

    let project;
    if (file.endsWith('.json')) {
      project = JSON.parse(content);
    } else {
      // Parser le front matter pour les fichiers .md
      const { data } = matter(content);
      project = data;
    }

    if (!project || !project.slug) return null;

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
      slides: Array.isArray(project.slides)
        ? project.slides.map(slide => ({
            type: slide.type,
            ...(slide.type === 'youtube' ? { videoId: slide.src } : { src: slide.src })
          }))
        : [],
      description: project.description,
      tags: project.tags || []
    };
  }).filter(Boolean); // Enlever les projets null

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

// Pour l'instant, on réexporte les données qui ne sont pas encore dans le CMS
export { faq, accompagnements, articles } from './data';
`;

  fs.writeFileSync(outputFile, content, 'utf-8');
  console.log(`✅ Fichier généré : ${outputFile}`);
  console.log(`📦 ${projects.length} projets chargés depuis le CMS`);
}

generateDataFile();
