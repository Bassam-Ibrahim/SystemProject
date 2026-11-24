require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const { PORT = 5000, MONGODB_URI, JWT_SECRET } = process.env;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error('Missing MONGODB_URI or JWT_SECRET in .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });