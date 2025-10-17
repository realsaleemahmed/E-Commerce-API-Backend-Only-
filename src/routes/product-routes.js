const express = require('express');
const { createProduct, getAllProducts, getProductById,updateProduct,deleteProduct } = require('../controllers/product-controller.js');
const { createReview, getAllReviews, updateReview, deleteReview } = require('../controllers/review-controller.js');
const { protect }  = require('../middlewares/auth-middleware.js');
const { isSellerOrAdmin }  = require('../middlewares/seller-and-admin-middleware.js');
const router = express.Router();

router.post('/',protect, isSellerOrAdmin, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id',protect, isSellerOrAdmin, updateProduct);
router.delete('/:id',protect, isSellerOrAdmin, deleteProduct);

//nested review routes

router.get('/:id/reviews', getAllReviews);
router.post('/:id/reviews',protect, createReview);
router.put('/:id/reviews/:reviewId',protect, updateReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);


module.exports = router;

