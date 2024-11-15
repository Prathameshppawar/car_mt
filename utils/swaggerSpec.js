// Example of a simple swagger spec or use swagger-jsdoc to generate this dynamically
const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'Description of my API'
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'User login',
          responses: {
            200: {
              description: 'A successful token gen',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  
  export default swaggerSpec;
  