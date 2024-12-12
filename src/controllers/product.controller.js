import { Product } from "../models/product.js";

const addProduct = async (req, res) => {
  const newProduct = new Product({
    ...req.body,
    createdOn: new Date(),
  });

  newProduct
    .save()
    .then((product) => {
      res.status(200).json({
        message: "Product added successfully",
        product,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};

const getAllProducts = async (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json({
        message: "All products fetched successfully",
        allProduct: products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error fetching products",
        error: err,
      });
    });
};

const deleteProduct = async (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        res.status(200).json({
          message: "Product deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const editProduct = async (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((product) => {
      if (product) {
        res.status(200).json({
          message: "Product edited successfully",
          product,
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
const getProductByProductId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ productDetails: product });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export { addProduct, deleteProduct, editProduct, getAllProducts, getProductByProductId }
