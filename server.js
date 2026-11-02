
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
const products = [
    {
        id: 1,
        name: "Handmade Greeting Card",
        description: "Beautiful handmade greeting card",
        price: 100,
        image: "💌"
    },
    {
        id: 2,
        name: "Decorative Candle",
        description: "Handcrafted scented candle",
        price: 250,
        image: "🕯️"
    },
    {
        id: 3,
        name: "Woolen Art",
        description: "Colorful handmade woolen craft",
        price: 350,
        image: "🧶"
    },
    {
        id: 4,
        name: "Flower Vase",
        description: "Decorative handmade flower vase",
        price: 400,
        image: "🏺"
    },
    {
        id: 5,
        name: "Beaded Bracelet",
        description: "Beautiful handmade bracelet",
        price: 150,
        image: "📿"
    },
    {
        id: 6,
        name: "Paper Craft",
        description: "Creative handmade paper decoration",
        price: 200,
        image: "🎨"
    }
];
let cart = [];
let orders = [];
app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../public", "index.html"));
});
app.get("/api/products", (req, res) => {
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});
app.get("/api/cart", (req, res) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.status(200).json({
        success: true,
        data: cart,
        total: total
    });
});
app.post("/api/cart", (req, res) => {
    const productId = Number(req.body.productId);
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(400).json({
            success: false,
            message: "Invalid product"
        });
    }
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    res.status(201).json({
        success: true,
        message: "Product added to cart successfully"
    });
});
app.delete("/api/cart/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Cart item not found"
        });
    }
    cart.splice(index, 1);
    res.status(200).json({
        success: true,
        message: "Product removed from cart"
    });
});
app.post("/api/orders", (req, res) => {
    if (cart.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Your shopping cart is empty"
        });
    }
    const order = {
        orderId: Date.now(),
        items: cart.map(item => ({ ...item })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    orders.push(order);
    cart = [];
    res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        data: order
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint Not Found"
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});
app.listen(PORT, () => {
    console.log(`Crafty Corner server running at http://localhost:${PORT}`);
});
