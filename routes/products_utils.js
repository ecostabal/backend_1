const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

// Leer productos desde el archivo
const readProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

// Escribir productos al archivo
const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

module.exports = {
    readProducts,
    writeProducts
};
