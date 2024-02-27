window.onload = function() {
    let productList = document.getElementById('productList');

    products.forEach(product => {
        let productElement = document.createElement('div');
        productElement.innerHTML = `
        <div id="clickable"> 
        <a href="product.html?id=${product.id}">
            <img src=${product.photo}>
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>${product.price}</p>
            </a>
        </div>
        `;
        productList.appendChild(productElement);
    });
};
