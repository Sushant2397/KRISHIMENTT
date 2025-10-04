require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const equipmentRoutes = require('./routes/equipment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/equipment', equipmentRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers-market';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
});
