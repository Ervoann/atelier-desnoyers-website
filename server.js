const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve React static files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback: serve React app for all routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Site React démarré sur le port ${PORT}`);
  console.log(`📱 Site web: http://localhost:${PORT}`);
  console.log(`\nStrapi CMS tourne séparément en local sur http://localhost:1337`);
});
