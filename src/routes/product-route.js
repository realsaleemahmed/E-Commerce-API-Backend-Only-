const express = require('express');
const { createProduct, getAllProducts, getProductById,updateProduct,deleteProduct } = require('../controllers/product-controller.js');
const protect  = require('../middlewares/auth-middleware.js');
const isSellerOrAdmin  = require('../middlewares/seller-and-admin-middleware.js');
const router = express.Router();

router.post('/',protect, isSellerOrAdmin, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id',protect, isSellerOrAdmin, updateProduct);
router.delete('/:id',protect, isSellerOrAdmin, deleteProduct);

module.exports = router;

