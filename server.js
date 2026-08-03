import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve React static files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback: serve React app for all routes (SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Site React démarré sur le port ${PORT}`);
  console.log(`📱 Site web: http://localhost:${PORT}`);
  console.log(`\nStrapi CMS tourne séparément sur Render: https://atelier-desnoyers-strapi.onrender.com`);
});
