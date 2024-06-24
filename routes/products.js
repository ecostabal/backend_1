const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

        const products = await Product.paginate(filter, options);
        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

module.exports = router;
