const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const user = req.user;

    const productId = req.params.id;

    const { rating, comment } = req.body;
    if(!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    const product = await Product.findById(req.params.id);
    if(!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    const existingReview = await Review.findOne({ user: user.id, product: product._id });
    if(existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      })
    }
    const review = new Review({ 
      user: user.id, 
      rating, 
      comment, 
      product: product._id 
    });

    await review.save();

    const reviews = await Review.find({ product: product._id });
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    product.ratings.average = sum / reviews.length;
    product.ratings.count = reviews.length;

    await product.save();
    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
      data: {
        rating: product.ratings.average,
        count: product.ratings.count
      }
    });
  } catch(error) {
    return res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`,
      }
    )
  }
};

const getAllReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId });
      return res.status(200).json({
        success: true,
        message: 'Reviews fetched successfully',
        data: reviews
      });
    } catch(error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`

    })
  }
};

const updateReview = async (req, res) => {
  try {
    const user = req.user;
    const { reviewId }= req.params;
    const { rating, comment } = req.body;
    
    const review = await Review.findById(reviewId);
    if(!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })  
    }

    if(user.role !== 'admin' && user.id.toString() !== review.user.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    review.rating = rating;
    review.comment = comment;
    
    const updatedReview = await review.save();

    const product = await Product.findById(review.product);
    if(product) {
    const reviews = await Review.find({ product: review.product });
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    product.ratings.average = sum / reviews.length;
    product.ratings.count = reviews.length;
    await product.save();
    }
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`
    })
  }
};

const deleteReview = async (req, res) => {
  try {
    const user = req.user;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if(!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    if(user.role !== 'admin' && user.id.toString() !== review.user.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }
    const product = await Product.findById(review.product);
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if(product) {
      const reviews = await Review.find({ product: review.product });
      if(reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      product.ratings.average = sum / reviews.length;
      product.ratings.count = reviews.length;
      } else {
        product.ratings.average = 0;
        product.ratings.count = 0;
      }
      await product.save();
    }
    res.status(200).json({
      status: true,
      message: "Deleted",
      data: deletedReview
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`
    })
  }
};

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview
};