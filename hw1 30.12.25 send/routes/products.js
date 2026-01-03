const express = require("express");
const router = express.Router();
const data = require("../data");

// GET /api/products - Get all products
router.get("/", (req, res) => {
  res.json({ products: data.products });
});

// GET /api/products/:id - Get specific product
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = data.products.find((item) => item.id === parseInt(id));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: `Product with ID: ${id} not found` });
  }
});

// POST /api/products - Add new product
router.post("/", (req, res) => {
  const { id, name, price, stock } = req.body;

  // Validation 1: Required fields
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  // Validation 2: Unique ID
  const existingProduct = data.products.find((item) => item.id === id);
  if (existingProduct) {
    return res
      .status(400)
      .json({ message: `Product with ID: ${id} already exists` });
  }

  // Validation 3: Price must be greater than 0
  if (price <= 0) {
    return res.status(400).json({ message: "Price must be greater than 0" });
  }

  // Validation 4: Stock must be positive (if provided)
  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ message: "Stock must be a positive number" });
  }

  // Add the product
  const newProduct = { id, name, price, stock };
  data.products.push(newProduct);
  res.status(201).json({
    message: "Product added",
    product: newProduct,
    products: data.products,
  });
});

// PUT /api/products/:id - Update existing product
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  // Find product index
  const productInd = data.products.findIndex(
    (item) => item.id === parseInt(id)
  );

  if (productInd === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Validation 1: Price must be greater than 0 (if provided)
  if (price !== undefined && price <= 0) {
    return res.status(400).json({ message: "Price must be greater than 0" });
  }

  // Validation 2: Stock must be positive (if provided)
  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ message: "Stock must be a positive number" });
  }

  // Update the product
  data.products[productInd] = {
    id: parseInt(id),
    name: name || data.products[productInd].name,
    price: price || data.products[productInd].price,
    stock: stock !== undefined ? stock : data.products[productInd].stock,
  };

  res.json({
    message: `Product with ID: ${id} updated`,
    product: data.products[productInd],
    products: data.products,
  });
});

// DELETE /api/products/:id - Delete product
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const productInd = data.products.findIndex(
    (item) => item.id === parseInt(id)
  );

  if (productInd === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Delete the product
  data.products.splice(productInd, 1);
  res.json({
    message: `Product with ID: ${id} deleted`,
    products: data.products,
  });
});

module.exports = router;
