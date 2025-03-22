// src/controllers/crm.controller.js
const Inquiry = require('../models/inquiry.model');
const User = require('../models/user.model');
const Service = require('../models/service.model');
const Notification = require('../models/notification.model');
const { sendWhatsAppMessage } = require('../services/whatsapp.service');

// Get all inquiries (admin only)
exports.getAllInquiries = async (req, res) => {
  try {
    const { status, serviceId } = req.query;
    
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by service if provided
    if (serviceId) {
      query.serviceId = serviceId;
    }
    
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 });
    
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiry by ID (admin or owner)
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    // Check if user is admin or the owner of the inquiry
    if (req.user.role !== 'admin' && inquiry.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this inquiry' });
    }
    
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inquiry status (admin only)
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, assignedTo, followupNeeded, followupDate } = req.body;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status,
        assignedTo,
        followupNeeded,
        followupDate
      },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    // If status changed to "in-progress", calculate response time
    if (status === 'in-progress' && inquiry.status !== 'in-progress') {
      const responseTime = Math.floor((Date.now() - inquiry.createdAt) / (1000 * 60)); // in minutes
      inquiry.responseTime = responseTime;
      await inquiry.save();
    }
    
    // Notify user about status change
    if (inquiry.userId) {
      const notification = new Notification({
        userId: inquiry.userId,
        title: 'Inquiry Status Update',
        message: `Your inquiry about ${inquiry.serviceName} has been updated to "${status}"`,
        type: 'service',
        relatedItemId: inquiry._id
      });
      
      await notification.save();
    }
    
    res.status(200).json({
      message: 'Inquiry status updated successfully',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's inquiries
exports.getUserInquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const inquiries = await Inquiry.find({ userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add response to inquiry (admin only)
exports.addInquiryResponse = async (req, res) => {
  try {
    const { response } = req.body;
    const inquiryId = req.params.id;
    
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    // Add response to inquiry
    inquiry.responses = inquiry.responses || [];
    inquiry.responses.push({
      message: response,
      timestamp: Date.now(),
      adminId: req.user.id
    });
    
    await inquiry.save();
    
    // Send WhatsApp message to user if phone available
    const user = await User.findById(inquiry.userId);
    if (user && user.phone) {
      await sendWhatsAppMessage(
        user.phone,
        `Response to your inquiry about ${inquiry.serviceName}: ${response}`
      );
    }
    
    res.status(200).json({
      message: 'Response added successfully',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiries requiring follow-up (admin only)
exports.getFollowupInquiries = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const inquiries = await Inquiry.find({
      followupNeeded: true,
      followupDate: { $lte: currentDate },
      status: { $ne: 'closed' }
    }).sort({ followupDate: 1 });
    
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get CRM analytics (admin only)
exports.getCRMAnalytics = async (req, res) => {
  try {
    // Total inquiries
    const totalInquiries = await Inquiry.countDocuments();
    
    // Inquiries by status
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const inProgressInquiries = await Inquiry.countDocuments({ status: 'in-progress' });
    const resolvedInquiries = await Inquiry.countDocuments({ status: 'resolved' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'closed' });
    
    // Inquiries by service category
    const inquiriesByService = await Inquiry.aggregate([
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
      }
    ]);
    
    // Average response time
    const avgResponseTime = await Inquiry.aggregate([
      {
        $match: { responseTime: { $exists: true } }
      },
      {
        $group: {
          _id: null,
          averageTime: { $avg: '$responseTime' }
        }
      }
    ]);
    
    res.status(200).json({
      totalInquiries,
      byStatus: {
        new: newInquiries,
        inProgress: inProgressInquiries,
        resolved: resolvedInquiries,
        closed: closedInquiries
      },
      byService: inquiriesByService,
      averageResponseTime: avgResponseTime.length > 0 ? avgResponseTime[0].averageTime : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};