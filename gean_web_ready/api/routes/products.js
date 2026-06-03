const express  = require('express');
const fs       = require('fs');
const path     = require('path');
const router   = express.Router();

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data');

function loadProducts() {
  const raw = fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8');
  return JSON.parse(raw);
}

/* GET /api/products */
router.get('/', function (req, res) {
  try {
    const items = loadProducts();
    res.json({ items, total: items.length });
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    res.status(500).json({ error: 'Internal server error', code: 'PRODUCTS_READ_FAILED' });
  }
});

/* GET /api/products/:id */
router.get('/:id', function (req, res) {
  try {
    const items   = loadProducts();
    const product = items.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found', code: 'PRODUCT_NOT_FOUND' });
    res.json(product);
  } catch (err) {
    console.error('GET /api/products/:id error:', err.message);
    res.status(500).json({ error: 'Internal server error', code: 'PRODUCTS_READ_FAILED' });
  }
});

module.exports = router;
