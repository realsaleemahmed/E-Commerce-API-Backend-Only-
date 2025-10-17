const express = require('express');
const { protect }  = require('../middlewares/auth-middleware.js');
const { getCart, addItemToCart, removeItemFromCart, clearCart } = require('../controllers/cart-controller.js');
const router = express.Router();


router.get('/', protect, getCart )
router.post('/', protect, addItemToCart )
router.delete('/items/:productId', protect, removeItemFromCart)
router.delete('/', protect, clearCart)

module.exports = router;