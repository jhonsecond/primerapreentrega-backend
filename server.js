const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const exphbs = require('express-handlebars');
const { getProducts, saveProducts } = require('./routes/products');
const { getCarts, saveCarts } = require('./routes/carts');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const products = getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = getProducts();
  res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('addProduct', (newProduct) => {
    const products = getProducts();
    products.push(newProduct);
    saveProducts(products);
    io.emit('productAdded', newProduct);
  });

  socket.on('deleteProduct', (deletedProduct) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === deletedProduct.id);
    if (index !== -1) {
      products.splice(index, 1);
      saveProducts(products);
      io.emit('productDeleted', deletedProduct);
    }
  });
});

const PORT = 8080;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
