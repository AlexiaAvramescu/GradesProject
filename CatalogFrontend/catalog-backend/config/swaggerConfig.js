// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation with Swagger',
    },
  },
  apis: ['./routes/*.js'], // path to the route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
