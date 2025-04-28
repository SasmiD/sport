import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart items from the backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cart");
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data = await response.json();
        setCartItems(data);
        calculateTotalPrice(data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price of items in the cart
  const calculateTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
  };

  // Handle quantity change
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const updatedCartItems = cartItems.map((item) =>
        item._id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${itemId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
      const filteredCartItems = cartItems.filter(
        (item) => item._id !== itemId
      );
      setCartItems(filteredCartItems);
      calculateTotalPrice(filteredCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">Color: {item.color}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400"
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  LKR {item.price.toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>
            <div className="flex justify-between mb-4">
              <p className="text-lg font-semibold">Total:</p>
              <p className="text-lg font-semibold text-blue-500">
                LKR {totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaShoppingCart /> Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
