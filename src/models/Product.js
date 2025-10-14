const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String,
  }],
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default:0
    },
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{timestamps : true}
);

module.exports = mongoose.model('Product', ProductSchema);