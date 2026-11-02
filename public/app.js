// Get HTML elements
const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const total = document.getElementById("total");
const message = document.getElementById("message");
// Load products from server
async function loadProducts() {
    const response = await fetch("/api/products");
    const result = await response.json();
    productList.innerHTML = "";
    result.data.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";
        const emoji = document.createElement("div");
        emoji.className = "emoji";
        emoji.textContent = product.image;
        const name = document.createElement("h3");
        name.textContent = product.name;
        const description = document.createElement("p");
        description.textContent = product.description;
        const price = document.createElement("p");
        price.textContent = "Price: ₹" + product.price;
        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.addEventListener("click", function() {
            addToCart(product.id);
        });
        div.append(emoji, name, description, price, button);
        productList.appendChild(div);
    });
}
// Add product to cart
async function addToCart(productId) {
    const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId: productId })
    });
    const result = await response.json();
    message.textContent = result.message;
    if (response.ok) {
        loadCart();
    }
}
// Load cart from server
async function loadCart() {
    const response = await fetch("/api/cart");
    const result = await response.json();
    cartItems.innerHTML = "";
    if (result.data.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }
    result.data.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        const details = document.createElement("span");
        details.textContent =
            item.name + " x " + item.quantity +
            " = ₹" + (item.price * item.quantity);
        const button = document.createElement("button");
        button.className = "remove-btn";
        button.textContent = "Remove";
        button.addEventListener("click", function() {
            removeFromCart(item.id);
        });
        div.append(details, button);
        cartItems.appendChild(div);
    });

    total.textContent = "Total: ₹" + result.total;
}
// Remove product from cart
async function removeFromCart(productId) {
    const response = await fetch("/api/cart/" + productId, {
        method: "DELETE"
    });
    const result = await response.json();
    message.textContent = result.message;
    if (response.ok) {
        loadCart();
    }
}
// Place an order
async function placeOrder() {
    const response = await fetch("/api/orders", {
        method: "POST"
    });
    const result = await response.json();
    message.textContent = result.message;
    if (response.ok) {
        loadCart();
    }
}
// Load products and cart when page opens
loadProducts();
loadCart();
