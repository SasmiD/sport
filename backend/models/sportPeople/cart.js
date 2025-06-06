const mongoose = require('mongoose');

// Cart schema
const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
