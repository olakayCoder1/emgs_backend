const { faker } = require('@faker-js/faker');
const Service = require('../models/service.model');

// The categories list that you mentioned
const categories = [
  'Job Application', 
  'IELTS Masterclass', 
  'Parcel Services', 
  'Flight Booking', 
  'Visa Booking', 
  'Loan Services', 
  'NCLEX Services', 
  'CBT Services', 
  'OET Services', 
  'OSCE Services',
  'Proof of Funds'
];

// Function to create a service for each category
const createDefaultServices = async () => {
  try {
    for (const category of categories) {
      // Check if a service already exists in this category
      const serviceExists = await Service.exists({ category });

      if (!serviceExists) {
        // Generate fake data for the service
        const fakeService = new Service({
          name: faker.company.name(),
          description: faker.lorem.sentence(), 
          category, // Category from the list
          whatsappContact: "07058728421", 
          price: faker.commerce.price(), 
          isActive: true, // Set it active
        });

        // Save the fake service to the database
        await fakeService.save();
        console.log(`Created default service for category: ${category}`);
      }
    }

    console.log("All default services have been created if they didn't already exist.");
  } catch (error) {
    console.error("Error creating services:", error);
  }
};

// Export the function using CommonJS syntax
module.exports = { createDefaultServices };
