const express = require('express');
const router = express.Router();
const Cart = require('../model/sportPeople/cart');  // Import the Cart model

// Add product to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, name, price, quantity, color, image } = req.body;

    // Create a new cart item
    const newCartItem = new Cart({
      productId,
      name,
      price,
      quantity,
      color,
      image,
    });

    await newCartItem.save();

    res.status(201).json({ message: "Item added to cart", item: newCartItem });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Optional: Delete item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
