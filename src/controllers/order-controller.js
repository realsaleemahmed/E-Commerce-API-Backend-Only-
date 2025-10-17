const Order = require('../models/Order');
const Product = require('../models/Product');



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
};

const getMyOrders = async (req,res) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: orders
    });
 
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

const getOrderById = async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);

    if(!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    //Permission check
    const user = req.user;
    if(user.role !== 'admin' && order.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch(error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

const updateOrderToPaid = async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    order.paymentStatus = 'completed';
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({
      success: true,
      message: 'Order payment status updated to paid',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: `Server Error ${error.message}`
      }
    )
  }
};

const updateOrderToDelivered = async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    order.orderStatus = 'delivered';
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated to delivered',
      data: updatedOrder
    })
  } catch(error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`
    })
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered
}
