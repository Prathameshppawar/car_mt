import { NextResponse } from 'next/server';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from '@utils/swaggerSpec';

export async function GET() {
  // If the swaggerSpec exists, use swagger-ui-express to render the Swagger UI HTML
  if (swaggerSpec) {
    const swaggerHtml = swaggerUi.generateHTML(swaggerSpec, {
      customCss: '.swagger-ui { background-color: #f4f4f4; }', // Optional: Custom CSS
      customSiteTitle: 'My API Documentation', // Optional: Custom site title
      customfavIcon: '/path/to/favicon.ico', // Optional: Custom favicon
      swaggerUrl: '/api/docs/swagger.json', // URL for your Swagger JSON
      // You can add more customization here
    });

    return new NextResponse(swaggerHtml, { status: 200 });
  }

  // Fallback response if Swagger spec is not found
  return new NextResponse('Swagger documentation not available', { status: 404 });
}
