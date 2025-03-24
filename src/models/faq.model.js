const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Create index for better query performance
faqSchema.index({ courseId: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;