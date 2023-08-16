const express = require('express');
const router = express.Router();
const fs = require('fs');

// Función para obtener los productos desde el archivo products.json
function getProducts() {
  const data = fs.readFileSync('./data/products.json', 'utf8');
  return JSON.parse(data);
}

// Función para guardar los productos en el archivo products.json
function saveProducts(products) {
  fs.writeFileSync('./data/products.json', JSON.stringify(products), 'utf8');
}

// Ruta para listar todos los productos
router.get('/', (req, res) => {
  const products = getProducts();
  res.json(products);
});

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === req.params.pid);
  res.json(product);
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
  const products = getProducts();
  const newProduct = req.body;

  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ message: 'Campos obligatorios faltantes' });
  }

  newProduct.id = Date.now().toString();
  products.push(newProduct);
  saveProducts(products);
  res.json(newProduct);
});

// Ruta para actualizar un producto por su ID
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

// Ruta para eliminar un producto por su ID
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