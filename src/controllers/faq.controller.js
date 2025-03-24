const FAQ = require('../models/faq.model');
const Course = require('../models/course.model');
const { successResponse, errorResponse, badRequestResponse } = require('../utils/custom_response/responses');

// Add a new FAQ (admin only)
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const adminId = req.user.id;
    
    // Create new FAQ
    const newFAQ = new FAQ({
      question,
      answer,
      createdBy: adminId
    });
    
    await newFAQ.save();
    
    return successResponse({faq: newFAQ
    }, res, 201, 'FAQ added successfully');
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Update FAQ (admin only)
exports.updateFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer } = req.body;
    
    const faq = await FAQ.findById(faqId);
    if (!faq) {
      return badRequestResponse('FAQ not found', 'NOT_FOUND', 404, res);
    }
    

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    
    await faq.save();
    
    return successResponse({ faq
    }, res,200,'FAQ updated successfully');
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};


exports.deleteFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;
    
    const faq = await FAQ.findByIdAndDelete(faqId);
    if (!faq) {
      return badRequestResponse('FAQ not found', 'NOT_FOUND', 404, res);
    }
    
    return successResponse({}, res,204,'FAQ deleted successfully');
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};


exports.getCourseFAQs = async (req, res) => {
  try {
    
    // Get all FAQs for the course
    const faqs = await FAQ.find()
      .sort({ createdAt: 1 });
    
    return successResponse(faqs, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};