const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Obtener productos de un carrito específico
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Agregar un producto a un carrito específico
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
        if (productIndex === -1) {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Eliminar un producto de un carrito específico
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Actualizar productos en un carrito específico
router.put('/:cid', async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Actualizar la cantidad de un producto en un carrito específico
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = req.body.quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Eliminar todos los productos de un carrito específico
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

module.exports = router;
