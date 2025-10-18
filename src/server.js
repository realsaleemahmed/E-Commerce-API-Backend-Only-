require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');
const productRoutes = require('./routes/product-routes');
const authRoutes = require('./routes/auth-routes');
const orderRoutes = require('./routes/order-routes');
const cartRouters = require('./routes/cart-routes');
const app = express();

app.use(express.json());

//for server health check
app.get('/', (req, res) => {
  res.send('API is running...');
});
//routes

//login and register routes
app.use('/api/auth', authRoutes);

//product routes
app.use('/api/products', productRoutes);

//order routes
app.use('/api/orders', orderRoutes);

//cart routes
app.use('/api/cart', cartRouters);


const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch(e) {
    console.error('Failed to connect to the database', e);
    process.exit(1);
  }
};

startServer();

