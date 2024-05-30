const express = require('express');
const { create } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

const productsRouter = require('./routes/products')(io);
const cartsRouter = require('./routes/carts');

// Importar la función readProducts desde products.js
const { readProducts } = require('./routes/products_utils');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
