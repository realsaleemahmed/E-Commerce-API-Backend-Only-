//order controller will contain all the logic related to order management
const Order = require('../models/order-model');
const Product = require('../models/Product');

// Create a new order

const createOrder = async (req,res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if(!orderItems || orderItems.length === 0 ) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      })
    }

    let processedOrderItems = [];
    let calculatedTotalAmount = 0;
    
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if(!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        })
      }

      processedOrderItems.push({
      product: product._id,
      seller: product.sellerId,
      quantity: item.quantity,
      price: product.price
    });
      calculatedTotalAmount += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user.id,
      orderItems: processedOrderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: calculatedTotalAmount
    })

    const createdOrder = await order.save();
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    })
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
}
