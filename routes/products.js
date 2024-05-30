const express = require('express');
const router = express.Router();
const { readProducts, writeProducts } = require('./products_utils');

module.exports = (io) => {
    // Ruta GET / (listar todos los productos)
    router.get('/', (req, res) => {
        const products = readProducts();
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        res.json(products.slice(0, limit));
    });

    // Ruta GET /:pid (obtener producto por id)
    router.get('/:pid', (req, res) => {
        const products = readProducts();
        const product = products.find(p => p.id === req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    });

    // Ruta POST / (agregar un nuevo producto)
    router.post('/', (req, res) => {
        const products = readProducts();
        const newProduct = {
            id: (products.length + 1).toString(),
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status !== undefined ? req.body.status : true,
            stock: req.body.stock,
            category: req.body.category,
            thumbnails: req.body.thumbnails || []
        };

        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
        }

        products.push(newProduct);
        writeProducts(products);
        res.status(201).json(newProduct);
        io.emit('productAdded', newProduct); // Emitir evento
    });

    // Ruta PUT /:pid (actualizar un producto)
    router.put('/:pid', (req, res) => {
        const products = readProducts();
        const productIndex = products.findIndex(p => p.id === req.params.pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const updatedProduct = {
            ...products[productIndex],
            ...req.body,
            id: products[productIndex].id // Asegurarse de que el ID no se actualice
        };

        products[productIndex] = updatedProduct;
        writeProducts(products);
        res.json(updatedProduct);
        io.emit('productUpdated', updatedProduct); // Emitir evento
    });

    // Ruta DELETE /:pid (eliminar un producto)
    router.delete('/:pid', (req, res) => {
        const products = readProducts();
        const productIndex = products.findIndex(p => p.id === req.params.pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const deletedProduct = products.splice(productIndex, 1);
        writeProducts(products);
        res.status(204).send();
        io.emit('productDeleted', deletedProduct[0]); // Emitir evento
    });

    return router;
};
