const cartTable = document.getElementById("cartTable");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
    cartTable.innerHTML = "";
    let total = 0;

    cart.forEach((product, index) => {
        const subtotal = product.price * product.qty;
        total += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td>
                <input type="number" value="${product.qty}" data-index="${index}" class="qty-input">
            </td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="remove" data-index="${index}">Remove</button>
            </td>
        `;
        cartTable.appendChild(row);
    });

    document.getElementById("total").innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    
    setupListeners();
}

function setupListeners() {
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            saveAndReload();
        });
    });

    document.querySelectorAll(".qty-input").forEach(input => {
        input.addEventListener("change", (e) => {
            const index = e.target.dataset.index;
            const newQty = parseInt(e.target.value);
            if (newQty > 0) {
                cart[index].qty = newQty;
                saveAndReload();
            }
        });
    });
}

function saveAndReload() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart(); 
}

renderCart();