const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
let currentProduct = null;

if (productId) {
    const url = `https://fakestoreapi.com/products/${productId}`;

    fetch(url)
        .then(res => res.json())
        .then(product => {
            currentProduct = product;
            const container = document.getElementById("productDetails");

            container.innerHTML = `
                <h2>${product.title}</h2>
                <img src="${product.image}" alt="${product.title}" style="width:200px;">
                <p>${product.description}</p>
                <p><strong>Price: $${product.price}</strong></p>
            `;
        });
}

document.getElementById("addToCartBtn").addEventListener("click", () => {
    const qty = parseInt(document.getElementById("quantity").value);
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        qty: qty
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
});