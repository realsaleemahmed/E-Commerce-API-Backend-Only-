const mongoose = require('mongoose');

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

const addItemToCart = async (req,res) => {
  
  try {
      const user = req.user;
      const {productId , quantity} = req.body;

      const product = await Product.findById(productId);
      if(!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }
      let cart = await Cart.findOne({user: user.id});

      if(!cart) {
        const newCart = new Cart({
          user: user.id,
          items: [{product: productId, quantity: quantity}]
        });
        await newCart.save();

        return res.status(201).json({
          success: true,
          message: 'Item added to cart successfully',
          data: newCart
        })
      } else {
      const sameproduct = cart.items.find(item => item.product.toString() === productId);
      if(sameproduct) {
        sameproduct.quantity += quantity;
      } else {
        cart.items.push({product: productId, quantity: quantity});
      }
      const newCart = await cart.save();

      res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        data: newCart
      })
    }} catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`
    })
  }
};

const getCart = async (req,res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOne({user: user.id}).populate('items.product');
    if(!cart)
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    res.status(200).json({
      success: true,
      data: cart
    })
  } catch(error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`
    })
  }
};

const removeItemFromCart = async (req,res) => {
  try{
    const user = req.user;
    const {productId} = req.params;

    const cart = await Cart.findOne({user: user.id});
    if(!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if(itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
  } catch(error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`})
  }
};