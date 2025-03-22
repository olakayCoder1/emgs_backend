// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express'); 
const swaggerSpec = require('./config/swagger'); 
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const lessonRoutes = require('./routes/lesson.routes');
const serviceRoutes = require('./routes/service.routes');
const crmRoutes = require('./routes/crm.routes');
const adminRoutes = require('./routes/admin.routes');
// const paymentRoutes = require('./routes/payment.routes');

// Initialize express app
const app = express();

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 
// app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;