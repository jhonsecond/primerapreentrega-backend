const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const express = require('express');
const app = express();
const http = require('http').Server(app); // Agrega esta línea
const io = require('socket.io')(http); // Agrega esta línea
const path = require('path'); // Para manejar rutas de archivos
const exphbs = require('express-handlebars'); // Handlebars

});
