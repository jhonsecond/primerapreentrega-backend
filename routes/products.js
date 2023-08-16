const express = require('express');
const router = express.Router();
const fs = require('fs');

function getProducts() {
  const data = fs.readFileSync('./data/products.json', 'utf8');
  return JSON.parse(data);
}

function saveProducts(products) {
  fs.writeFileSync('./data/products.json', JSON.stringify(products), 'utf8');
}

router.get('/', (req, res) => {
  const products = getProducts();
  res.json(products);
});

router.get('/:pid', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === req.params.pid);
  res.json(product);
});

router.post('/', (req, res) => {
  const products = getProducts();
  const newProduct = req.body;

  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ message: 'Campos obligatorios faltantes' });
  }

  newProduct.id = Date.now().toString(); // Generar ID único
  products.push(newProduct);
  saveProducts(products);
  res.json(newProduct);
});

router.put('/:pid', (req, res) => {
  const products = getProducts();
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === req.params.pid);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    saveProducts(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

router.delete('/:pid', (req, res) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === req.params.pid);
  if (index !== -1) {
    const deletedProduct = products.splice(index, 1);
    saveProducts(products);
    res.json(deletedProduct);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

module.exports = router;
