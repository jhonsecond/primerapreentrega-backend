const express = require('express');
const app = express();
const productsRouter = require('./products'); // Importa el router de productos
const cartsRouter = require('./carts'); // Importa el router de carritos

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter); // Usa el router de productos en /api/products
app.use('/api/carts', cartsRouter); // Usa el router de carritos en /api/carts

// Puerto
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
