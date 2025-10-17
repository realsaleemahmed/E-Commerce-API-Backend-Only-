const express = require('express');

const {   createOrder, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered} = require('../controllers/order-controller.js');
const {protect, isAdminUser}  = require('../middlewares/auth-middleware.js');

const router = express.Router();

//Custom Routes

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin Routes
router.put('/:id/deliver', protect, isAdminUser, updateOrderToDelivered);
router.put('/:id/pay', protect,isAdminUser, updateOrderToPaid);

module.exports = router;