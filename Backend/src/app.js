const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Add the team's routes back here once their files exist:
// app.use('/api/users', require('./routes/profileRoutes'));
// app.use('/api/items', require('./routes/itemRoutes'));
// app.use('/api/claims', require('./routes/claimRoutes'));

app.get('/', (req, res) => {
  res.send('Campus Lost & Found API is running...');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;