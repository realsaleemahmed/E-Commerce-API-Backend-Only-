const express = require('express');
const { createProduct, getAllProducts, getProductById,updateProduct,deleteProduct } = require('../controllers/product-controller.js');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

