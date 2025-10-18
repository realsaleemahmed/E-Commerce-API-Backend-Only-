const mongoose = require('mongoose');

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User'); // maybe for future user

const addItemToCart = async (req, res) => {
  try {
    const user = req.user;
    const { productId, quantity = 1 } = req.body; // Default quantity to 1

    // --- VALIDATION AT THE START ---
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }
    // Quantity validation (allow negative for removal, but not zero initially)
    if (!quantity || quantity === 0) {
        return res.status(400).json({
            success: false,
            message: 'Quantity cannot be zero'
        });
    }
    // --- END VALIDATION ---


    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // --- Initial Stock Check (For Adding a New Item) ---
    // We only check if the INITIAL quantity requested is > stock
    // The check for UPDATING quantity happens later
    if (quantity > 0 && quantity > product.stock) {
          return res.status(400).json({
              success: false,
              message: `Only ${product.stock} items available`
          });
    }
    // --- End Initial Stock Check ---

    let cart = await Cart.findOne({ user: user.id });

    if (!cart) {
        // ---- CASE 1: NO CART EXISTS ----
        if (quantity <= 0) { // Can't create a cart with non-positive quantity
            return res.status(400).json({
                success: false,
                message: 'Quantity must be positive to create a new cart'
            });
        }
          // Initial stock check already passed above
        const newCart = new Cart({
            user: user.id,
            items: [{ product: productId, quantity: quantity }]
        });
        await newCart.save();
        await newCart.populate('items.product'); // Populate before sending

        return res.status(201).json({
            success: true,
            message: 'Item added to cart successfully',
            data: newCart
        });

    } else {
        // ---- CASE 2: CART ALREADY EXISTS ----
        const sameProduct = cart.items.find(item => item.product.toString() === productId);

        if (sameProduct) {
            // Item is already in cart, update its quantity
            const newQuantity = sameProduct.quantity + quantity;

            // --- Stock Check for Update ---
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    // Clearer message: How many MORE can they add?
                    message: `Cannot add ${quantity} more. Only ${product.stock - sameProduct.quantity} additional items available (Total stock: ${product.stock}).`
                });
            }
            // --- End Stock Check ---

            sameProduct.quantity = newQuantity;

            // Check if quantity has dropped to 0 or below
            if (sameProduct.quantity <= 0) {
                const sameProductIndex = cart.items.findIndex(item => item.product.toString() === productId);
                cart.items.splice(sameProductIndex, 1);
            }
        } else {
            // Item is not in cart, add it (only if quantity is positive)
            if (quantity > 0) {
                  // Initial stock check already passed above
                cart.items.push({ product: productId, quantity: quantity });
            } else {
                  return res.status(400).json({
                      success: false,
                      message: 'Quantity must be positive to add a new item'
                  });
            }
        }

        const updatedCart = await cart.save();
        await updatedCart.populate('items.product'); // Populate before sending

        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: updatedCart
        });
    }
  } catch (error) {
      res.status(500).json({
          success: false,
          message: `Server Error: ${error.message}`
      });
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
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully'
    })
  } catch(error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`})
  }
};

const clearCart = async (req,res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOne({user: user.id});
    if(!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    })
  } catch(error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`})
  }
};

module.exports = {
  addItemToCart,
  getCart,
  removeItemFromCart,
  clearCart
};
