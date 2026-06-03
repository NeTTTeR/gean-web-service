const express  = require('express');
const fs       = require('fs');
const path     = require('path');
const router   = express.Router();

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data');

function loadArticles() {
  const raw  = fs.readFileSync(path.join(DATA_DIR, 'articles.json'), 'utf8');
  const list = JSON.parse(raw);
  return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/* GET /api/articles */
router.get('/', function (req, res) {
  try {
    const items = loadArticles();
    res.json({ items, total: items.length });
  } catch (err) {
    console.error('GET /api/articles error:', err.message);
    res.status(500).json({ error: 'Internal server error', code: 'ARTICLES_READ_FAILED' });
  }
});

/* GET /api/articles/:id */
router.get('/:id', function (req, res) {
  try {
    const articlePath = path.join(DATA_DIR, 'articles', `${req.params.id}.json`);
    if (!fs.existsSync(articlePath)) {
      return res.status(404).json({ error: 'Article not found', code: 'ARTICLE_NOT_FOUND' });
    }
    const raw = fs.readFileSync(articlePath, 'utf8');
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error('GET /api/articles/:id error:', err.message);
    res.status(500).json({ error: 'Internal server error', code: 'ARTICLE_READ_FAILED' });
  }
});

module.exports = router;
