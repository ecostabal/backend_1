const express = require('express');
const { create } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./models/Product');
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

// Conectar a MongoDB
connectDB();

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean(); // Utiliza lean() para mejorar el rendimiento en la vista
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
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
