import dbConnect from '@/utils/dbConnect';
import Car from '@/models/Car';
import jwt from 'jsonwebtoken';  // Import JWT to verify the token

// Middleware to verify JWT token
async function verifyToken(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Assuming Bearer token in Authorization header
  console.log(req.headers.get('Authorization')?.split(' ')[0]);
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // returns the decoded user info (e.g., userId)
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function GET(req, { params }) {
  await dbConnect();

  try {
    console.log('headers are ',req.headers)
    // const user = await verifyToken(req);  // Verifying token
    
    const car = await Car.findById(params.id);
    if (!car) {
      return new Response('Car not found', { status: 404 });
    }

    return new Response(JSON.stringify(car), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 401 });  // Unauthorized if token verification fails
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const id=params.id;
  console.log('logging id = ', id);

  try {
    // const user = await verifyToken(req);  // Verifying token

    const updates = await req.json();
    const updatedCar = await Car.findByIdAndUpdate(params.id, updates, { new: true });

    if (!updatedCar) {
      return new Response('Car not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedCar), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 401 });  // Unauthorized if token verification fails
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    // const user = await verifyToken(req);  // Verifying token

    const result = await Car.findByIdAndDelete(params.id);
    if (!result) {
      return new Response('Car not found', { status: 404 });
    }

    return new Response('Car deleted', { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 401 });  // Unauthorized if token verification fails
  }
}
