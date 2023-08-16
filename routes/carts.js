const express = require('express');
const router = express.Router();
const fs = require('fs');
const { getProducts } = require('./products'); // Importar la función getProducts

function getCarts() {
  const data = fs.readFileSync('./data/carts.json', 'utf8');
  return JSON.parse(data);
}

function saveCarts(carts) {
  fs.writeFileSync('./data/carts.json', JSON.stringify(carts), 'utf8');
}

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
      const product = products[productIndex];
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

module.exports = router;
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
        const product = products[productIndex];
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
  