const transporter = require('../config/email.config');
const emailTemplates = require('../utils/templates/email.templates');

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (fallback)
 * @returns {Promise} - Email sending result
 */
const sendEmail = async (to, subject, html, text) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
    to,
    subject,
    html,
    text
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Verification token
 * @returns {Promise} - Email sending result
 */
exports.sendVerificationEmail = async (to, name, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const { subject, html, text } = emailTemplates.getVerificationEmailTemplate(name, verificationLink);
  
  return await sendEmail(to, subject, html, text);
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Password reset token
 * @returns {Promise} - Email sending result
 */
exports.sendPasswordResetEmail = async (to, name, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const { subject, html, text } = emailTemplates.getPasswordResetEmailTemplate(name, resetLink);
  
  return await sendEmail(to, subject, html, text);
};