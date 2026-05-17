const table = document.getElementById("productTable");

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
        products.forEach(product => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <a href="details.html?id=${product.id}">
                        ${product.title}
                    </a>
                </td>
                <td>$${product.price}</td>
            `;

            table.appendChild(row);
        });
    })
    .catch(err => console.error("Error fetching products:", err));