const socket = io();

socket.on('productAdded', (product) => {
    const productList = document.getElementById('real-time-product-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${product.title} - ${product.price}`;
    productList.appendChild(listItem);
});

socket.on('productUpdated', (product) => {
    // Lógica para actualizar el producto en la lista
});

socket.on('productDeleted', (product) => {
    // Lógica para eliminar el producto de la lista
});
