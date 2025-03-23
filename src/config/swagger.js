const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', 
  info: {
    title: 'EMGS API', 
    version: '1.0.0', 
    description: 'Documentation for EMGS API', // Description of the API
  },
  servers: [
    {
      url: 'http://localhost:8000', 
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
