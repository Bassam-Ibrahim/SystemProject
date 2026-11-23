const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes (هتفعل تلقائي لما الفريق يكتب الكود بتاعهم)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/profileRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));

// Base Route
app.get('/', (req, res) => {
  res.send('Campus Lost & Found API is running...');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;