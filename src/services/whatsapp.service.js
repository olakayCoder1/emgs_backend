// src/services/whatsapp.service.js
const axios = require('axios');
require('dotenv').config();

// Send WhatsApp message using WhatsApp Business API
exports.sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // Format phone number if needed
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
    
    // You would need to set up WhatsApp Business API credentials
    // This is a simplified implementation
    const response = await axios.post(
      process.env.WHATSAPP_API_URL,
      {
        phone: formattedPhone,
        message,
        type: 'text'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    throw new Error('Failed to send WhatsApp message');
  }
};

// Handle incoming WhatsApp webhook
exports.handleWhatsAppWebhook = async (webhookData) => {
  try {
    const { from, message, timestamp } = webhookData;
    
    // Look up existing conversations or create new one
    // This would connect to your CRM system
    
    return {
      success: true,
      messageId: webhookData.id
    };
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    throw new Error('Failed to process WhatsApp webhook');
  }
};

// Get WhatsApp templates
exports.getWhatsAppTemplates = async () => {
  try {
    const response = await axios.get(
      `${process.env.WHATSAPP_API_URL}/templates`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    throw new Error('Failed to get WhatsApp templates');
  }
};

// Send template message
exports.sendTemplateMessage = async (phoneNumber, templateName, params) => {
  try {
    // Format phone number if needed
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
    
    const response = await axios.post(
      `${process.env.WHATSAPP_API_URL}/send-template`,
      {
        phone: formattedPhone,
        template: templateName,
        params
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    throw new Error('Failed to send WhatsApp template message');
  }
};
