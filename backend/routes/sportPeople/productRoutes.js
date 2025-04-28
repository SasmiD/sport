const express = require("express");
const Product = require("../../models/sportPeople/Product");
const upload = require("../../uploads");
const router = express.Router();

//Get all Products in loading
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get product by ID
router.get("/id/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Get Products by Category
router.get("/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ pd_category: category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Insert Product
router.post("/add", upload.fields([
  { name: "pd_image", maxCount: 1 },
  { name: "pd_side_images", maxCount: 10 },
]), async (req, res) => {
  try {
    const {
      pd_name,
      pd_category,
      pd_price,
      pd_description,
      pd_colors,
      pd_size
    } = req.body;

    const coverPhoto = req.files?.pd_image?.[0]?.filename || "";
    const sideImages = req.files?.pd_side_images?.map(file => file.filename) || [];

    const newProduct = new Product({
      pd_name,
      pd_category,
      pd_price,
      pd_image: coverPhoto,
      pd_side_images: sideImages,
      pd_description,
      pd_colors: pd_colors ? JSON.parse(pd_colors) : [],
      pd_size: pd_size ? JSON.parse(pd_size) : [],
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).json({ message: error.message });
  }
});


// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
