import swaggerSpec from '@utils/swaggerSpec'; // Adjust path accordingly

export async function GET() {
  return new NextResponse(JSON.stringify(swaggerSpec), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
