require('dotenv').config();
const express  = require('express');
const path     = require('path');
const cors     = require('./middleware/cors');

const app  = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors);
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  const compression = require('compression');
  app.use(compression());
}

/* Routes */
app.use('/api/products', require('./routes/products'));
app.use('/api/articles', require('./routes/articles'));

/* Health check */
app.get('/api/health', function (req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* 404 for unknown /api/* routes */
app.use('/api', function (req, res) {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});

/* Frontend static files and routing */
// Explicit rewrites from serve.json
app.get('/product-detail', (req, res) => res.sendFile(path.join(__dirname, '../public/product-detail.html')));
app.get('/article/detail', (req, res) => res.sendFile(path.join(__dirname, '../public/article-detail.html')));

// Serve static files with cleanUrls (auto-append .html)
app.use(express.static(path.join(__dirname, '../public'), {
  extensions: ['html']
}));

// Catch-all route to fallback to index.html (useful for 404s or client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, function () {
  console.log(`GEAN API running on http://localhost:${PORT}`);
  console.log(`DATA_DIR: ${process.env.DATA_DIR || path.join(__dirname, '../data')}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});
