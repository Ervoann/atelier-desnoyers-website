import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import strapi from './strapi/node_modules/@strapi/strapi/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  // Start Strapi programmatically
  const strapiInstance = await strapi({
    distDir: path.join(__dirname, 'strapi', 'dist'),
    autoReload: false,
  }).start();

  // Serve React static files (with fallback for SPA routing)
  app.use(express.static(path.join(__dirname, 'dist')));

  // Mount Strapi app on /admin and /api routes
  app.use('/admin', strapiInstance.server.app);
  app.use('/api', strapiInstance.server.app);
  app.use('/_health', strapiInstance.server.app);
  app.use('/i18n', strapiInstance.server.app);
  app.use('/content-manager', strapiInstance.server.app);
  app.use('/content-type-builder', strapiInstance.server.app);
  app.use('/upload', strapiInstance.server.app);
  app.use('/users-permissions', strapiInstance.server.app);

  // Fallback: serve React app for all other routes (SPA routing)
  app.get('*', (req, res) => {
    // Don't intercept Strapi routes
    if (
      req.path.startsWith('/admin') ||
      req.path.startsWith('/api') ||
      req.path.startsWith('/_health') ||
      req.path.startsWith('/i18n') ||
      req.path.startsWith('/content-manager') ||
      req.path.startsWith('/content-type-builder') ||
      req.path.startsWith('/upload') ||
      req.path.startsWith('/users-permissions')
    ) {
      return;
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  // Start the combined server
  app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📱 Site web: http://localhost:${PORT}`);
    console.log(`⚙️  Admin Strapi: http://localhost:${PORT}/admin`);
    console.log(`🔌 API Strapi: http://localhost:${PORT}/api`);
  });
}

startServer().catch((error) => {
  console.error('❌ Erreur au démarrage du serveur:', error);
  process.exit(1);
});
