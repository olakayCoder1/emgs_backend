// src/controllers/service.controller.js - continued
const Service = require('../models/service.model');
const User = require('../models/user.model');
const Inquiry = require('../models/inquiry.model');
const { sendWhatsAppMessage } = require('../services/whatsapp.service');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    const services = await Service.find(query)
      .sort({ category: 1 });
    
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new service (admin only)
exports.createService = async (req, res) => {
  try {
    const { name, description, category, whatsappContact, price } = req.body;
    
    const service = new Service({
      name,
      description,
      category,
      whatsappContact,
      price,
      isActive: true
    });
    
    await service.save();
    
    res.status(201).json({
      message: 'Service created successfully',
      serviceId: service._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service (admin only)
exports.updateService = async (req, res) => {
  try {
    const { name, description, category, whatsappContact, price, isActive } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        whatsappContact,
        price,
        isActive
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(200).json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete service (admin only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create service inquiry and redirect to WhatsApp
exports.createInquiry = async (req, res) => {
  try {
    const { serviceId, message } = req.body;
    const userId = req.user.id;
    
    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create inquiry
    const inquiry = new Inquiry({
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone || '',
      serviceId,
      serviceName: service.name,
      message,
      status: 'new'
    });
    
    await inquiry.save();
    
    // Prepare WhatsApp link
    const whatsappLink = `https://wa.me/${service.whatsappContact}?text=${encodeURIComponent(
      `Hello, I'm interested in ${service.name}. ${message}`
    )}`;
    
    res.status(201).json({
      message: 'Inquiry created successfully',
      inquiryId: inquiry._id,
      whatsappLink
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const services = await Service.find({ 
      category,
      isActive: true 
    });
    
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





