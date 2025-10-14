const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['customer','seller', 'admin'],
    default: 'customer'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  }
},
{timestamps : true}
);

module.exports = mongoose.model('User', UserSchema);