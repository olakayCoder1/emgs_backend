// src/controllers/admin.controller.js
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Lesson = require('../models/lesson.model');
const Service = require('../models/service.model');
const Inquiry = require('../models/inquiry.model');
const Payment = require('../models/payment.model');
const Notification = require('../models/notification.model');

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    // Course stats
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    
    // Enrollment stats
    const totalEnrollments = await Course.aggregate([
      {
        $project: {
          enrollmentCount: { $size: '$enrolledUsers' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$enrollmentCount' }
        }
      }
    ]);
    
    // Service stats
    const totalServices = await Service.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const pendingInquiries = await Inquiry.countDocuments({ status: 'new' });
    
    // Payment stats
    const totalPayments = await Payment.countDocuments({ status: 'completed' });
    const totalRevenue = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    res.status(200).json({
      users: {
        total: totalUsers,
        newToday: newUsersToday
      },
      courses: {
        total: totalCourses,
        lessons: totalLessons,
        enrollments: totalEnrollments.length > 0 ? totalEnrollments[0].total : 0
      },
      services: {
        total: totalServices,
        inquiries: totalInquiries,
        pending: pendingInquiries
      },
      payments: {
        total: totalPayments,
        revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, isVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        role,
        isVerified
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payments (admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status (admin only)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Notify user about payment status update
    const notification = new Notification({
      userId: payment.userId,
      title: 'Payment Update',
      message: `Your payment of ${payment.amount} ${payment.currency} has been ${status}`,
      type: 'payment',
      relatedItemId: payment._id
    });
    
    await notification.save();
    
    res.status(200).json({
      message: 'Payment status updated successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send notification to users (admin only)
exports.sendNotification = async (req, res) => {
  try {
    const { users, title, message, type } = req.body;
    
    if (!users || !users.length) {
      return res.status(400).json({ message: 'No users specified' });
    }
    
    // Create notifications for each user
    const notifications = users.map(userId => ({
      userId,
      title,
      message,
      type: type || 'system'
    }));
    
    await Notification.insertMany(notifications);
    
    res.status(200).json({
      message: 'Notifications sent successfully',
      count: notifications.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get system analytics (admin only)
exports.getSystemAnalytics = async (req, res) => {
  try {
    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Course enrollments over time
    const enrollmentTrend = await Course.aggregate([
      {
        $unwind: '$enrolledUsers'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'enrolledUsers',
          foreignField: '_id',
          as: 'userDocs'
        }
      },
      {
        $unwind: '$userDocs'
      },
      {
        $group: {
          _id: {
            year: { $year: '$userDocs.createdAt' },
            month: { $month: '$userDocs.createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Service inquiries by category
    const serviceInquiries = await Inquiry.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $group: {
          _id: '$service.category',
          count: { $sum: 1 }
        }
      },
      { $sort: { 'count': -1 } }
    ]);
    
    // Revenue by month
    const revenueByMonth = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.status(200).json({
      userGrowth,
      enrollmentTrend,
      serviceInquiries,
      revenueByMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};