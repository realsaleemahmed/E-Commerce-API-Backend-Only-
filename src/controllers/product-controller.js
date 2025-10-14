const mongoose = require('mongoose');
const Product = require('../models/Product');

const createProduct = async (req,res) => {
  try {
    if(!req.body.title || !req.body.description || !req.body.price || !req.body.category) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

const getAllProducts = async (req,res) => {
  try {
    //pagination 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
      pagination: {
        total,
        page,
        limit
      }
    })
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

const getProductById = async (req,res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

const updateProduct = async (req,res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

const deleteProduct = async (req,res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};