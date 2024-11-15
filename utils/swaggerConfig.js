import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'This is the API documentation for our application',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./app/api/**/*.js'],  // Adjust this path if necessary to point to your API files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
