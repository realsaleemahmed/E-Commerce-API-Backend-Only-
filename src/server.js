require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
})

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

