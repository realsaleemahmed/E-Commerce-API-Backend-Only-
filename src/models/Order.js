const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  shippingAddress: {
  street: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zip: {type: String, required: true},
  country: {type: String, required: true}
 },
 paymentMethod: {
    type: String,
    required: true,
    enum: [
      'credit_card',
      'paypal',
      'bank_transfer',
      'cash_on_delivery'
    ]
},
paymentStatus: {
  type: String,
  enum: ['pending', 'completed', 'failed'],
  default: 'pending'
},
paidAt: {
  type: Date,
},
deliveredAt: {
  type: Date,
},
orderStatus: {
  type: String,
  enum: ['processing', 'shipped', 'delivered', 'cancelled'],
  default: 'processing'
},
totalAmount: {
  type: Number,
  required: true,
  min: 0  
}, 

},
{timestamps : true}
);

module.exports = mongoose.model('Order', OrderSchema);
