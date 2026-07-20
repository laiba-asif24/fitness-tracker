// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Static folder for uploaded reports
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const workoutRoutes = require('./Routes/workoutRoutes');
const nutritionRoutes = require('./Routes/nutritionRoutes');

// const dashboardRoutes = require('./routes/dashboardRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const progressRoutes = require('./routes/progressRoutes');
// const reportRoutes = require('./routes/reportRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handling middleware (should be after all routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});