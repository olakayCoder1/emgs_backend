// src/controllers/service.controller.js - continued
const Service = require('../models/service.model');
const User = require('../models/user.model');
const Inquiry = require('../models/inquiry.model');
const { successResponse, badRequestResponse, internalServerErrorResponse } = require('../utils/custom_response/responses');

const { sendWhatsAppMessage } = require('../services/whatsapp.service');
const { createDefaultServices } = require('../utils/dafaultServices');

// Get all services
// exports.getAllServices = async (req, res) => {
//   try {
//     const { category } = req.query;
    
//     let query = { isActive: true };
    
//     // Filter by category if provided
//     if (category) {
//       query.category = category;
//     }
    
//     const services = await Service.find(query)
//       .sort({ category: 1 });
    
//     return successResponse(services,res,200,'Success');
//   } catch (error) {
//     return internalServerErrorResponse(error.message)
//   }
// };
exports.getAllServices = async (req, res) => {
  try {

    // Fetch all active services and group them by category
    const servicesByCategory = await Service.aggregate([
      { $match: { isActive: true } }, // Only active services
      {
        $group: {
          _id: "$category",  // Group by the 'category' field
          services: { $push: "$$ROOT" },  // Push all the fields of the service into an array
        }
      },
      { $sort: { _id: 1 } } // Sort the groups by category (_id)
    ]);

    // Send the success response with grouped services
    return successResponse(servicesByCategory, res, 200, 'Success');
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching and grouping services:', error);

    // Send the error response
    return internalServerErrorResponse(error.message, res);
  }
};



exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return badRequestResponse('Service not found',"NOT_FOUND",404,res)
    }
    
    return successResponse(service,res,200,'Success');
  } catch (error) {
    return internalServerErrorResponse(error.message, res, 500)
  }
};


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

    return successResponse({
      serviceId: service._id
    },res,201,'Service created successfully',)
  } catch (error) {
    return internalServerErrorResponse(error.message, res, 500);
  }
};


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
      return badRequestResponse('Service not found',"NOT_FOUND",404,res)
    }
    
    return successResponse({
      serviceId: service._id
    },res,200, 'Service updated successfully')
  } catch (error) {
    return internalServerErrorResponse(error.message, res, 500);
  }
};


exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return badRequestResponse('Service not found',"NOT_FOUND",404,res)
    }
    return successResponse(null,res,204, 'Service deleted successfully' )
  } catch (error) {
    return internalServerErrorResponse(error.message, res, 500);
  }
};


exports.createInquiry = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.id;
    
    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return badRequestResponse('Service not found',"NOT_FOUND",404,res)
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return badRequestResponse('User not found',"NOT_FOUND",404,res)
    }
    
    // Create inquiry
    const inquiry = new Inquiry({
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone || '',
      serviceId,
      serviceName: service.name,
      // message,
      status: 'new'
    });
    
    await inquiry.save();
    
    // Prepare WhatsApp link
    const whatsappLink = `https://wa.me/${service.whatsappContact}?text=${encodeURIComponent(
      `Hello, I'm interested in ${service.name}. ${service.description}`
    )}`;
    
    return successResponse({
      inquiryId: inquiry._id,
      whatsappLink
    },res,201, 'Inquiry created successfully',)
  } catch (error) {
    return internalServerErrorResponse(error.message, res, 500);
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
    
    return successResponse(services,res,200,'Success');
  } catch (error) {
    return internalServerErrorResponse(error.message, res, 500);
  }
};





