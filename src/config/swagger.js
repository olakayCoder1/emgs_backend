// src/config/swagger.js

const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // OpenAPI version
  info: {
    title: 'EMGS API', // Title of the API
    version: '1.0.0', // Version of the API
    description: 'Documentation for EMGS API', // Description of the API
  },
  servers: [
    {
      url: 'http://localhost:5001', // The server where your API is running
    },
  ],
};

// Options for the swaggerJSDoc
const options = {
  swaggerDefinition,
  apis: ['src/routes/*.js', 'src/controllers/*.js'], 
};

// Generate swagger spec
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
