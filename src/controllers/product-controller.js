const mongoose = require('mongoose');
const Product = require('../models/Product');

const createProduct = async (req,res) => {
  try {

    const { title, description, price, category, images, stock } = req.body;
    if(!title || !description || !price || !category || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }
    const product = new Product({
      title,
      description,
      price,
      category,
      stock,
      ...(images && {images}),
      sellerId: req.user.id
    })

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
    const products = await Product.find().sort({createdAt: -1}).skip(skip).limit(limit);
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
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    const product = await Product.findById(id);

    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    const user = req.user;
    if(user.role !== 'admin' && product.sellerId.toString() !== user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins and Sellers only.'
      });
    }

    const {title, description, price, category, images} = req.body;
    const updateData = {};
    if(title) updateData.title = title;
    if(description) updateData.description = description;
    if(price) updateData.price = price;
    if(category) updateData.category = category;
    if(images) updateData.images = images;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {new: true});

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
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
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    const product = await Product.findById(id);

    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    const user = req.user;

    if(user.role !== 'admin' && product.sellerId.toString() !== user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins and Sellers only.'
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
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