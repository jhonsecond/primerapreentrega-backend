const express = require('express');
const router = express.Router();
const fs = require('fs');
const { getProducts } = require('./products'); // Importar la función getProducts desde products.js

// Función para obtener los carritos desde el archivo carts.json
function getCarts() {
  const data = fs.readFileSync('./data/carts.json', 'utf8');
  return JSON.parse(data);
}

// Función para guardar los carritos en el archivo carts.json
function saveCarts(carts) {
  fs.writeFileSync('./data/carts.json', JSON.stringify(carts), 'utf8');
}

// Ruta para listar los productos en un carrito específico
router.get('/:cid/products', (req, res) => {
  const carts = getCarts();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    const cartProducts = cart.products;
    const products = getProducts();
    const productsInCart = products.filter(p => cartProducts.some(cp => cp.id === p.id));
    res.json(productsInCart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = getCarts();
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1; // Default: 1

  const cartIndex = carts.findIndex(cart => cart.id === cartId);
  if (cartIndex !== -1) {
    const products = getProducts();
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      const existingProduct = carts[cartIndex].products.find(p => p.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        carts[cartIndex].products.push({ id: productId, quantity });
      }

      saveCarts(carts);
      res.json(carts[cartIndex]);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  const carts = getCarts();
  const newCart = {
    id: Date.now().toString(),
    products: [] // Inicialmente el carrito no tiene productos
  };

  carts.push(newCart);
  saveCarts(carts);
  res.json(newCart);
});

// Ruta para obtener todos los carritos
router.get('/', (req, res) => {
  const carts = getCarts();
  res.json(carts);
});

// Ruta para obtener un carrito por su ID
router.get('/:cid', (req, res) => {
  const carts = getCarts();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Ruta para eliminar un carrito por su ID
router.delete('/:cid', (req, res) => {
  const carts = getCarts();
  const index = carts.findIndex(c => c.id === req.params.cid);
  if (index !== -1) {
    const deletedCart = carts.splice(index, 1);
    saveCarts(carts);
    res.json(deletedCart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

module.exports = router;
