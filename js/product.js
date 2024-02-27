window.onload = function() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');

    let product = products.find(p => p.id == id);

    let productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <img src=${product.photo}>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>${product.price}</p>
    `;
};
