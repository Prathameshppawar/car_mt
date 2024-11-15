import dbConnect from '@/utils/dbConnect';
import Car from '@/models/Car';
import { verifyToken } from '@/utils/authMiddleware'; // Import your token verification function
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req) {
  await dbConnect();

  try {
    // Verify the token and get the userId
    const decoded = verifyToken(req);
    const { userId } = decoded; // userId extracted from the token

    const { title, description, tags, images } = await req.json();

    // Ensure userId matches the one from the token
    if (!title || !description || !tags || !images || images.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const newCar = new Car({
      userId, // Add userId from token
      title,
      description,
      tags,
      images,
    });

    await newCar.save();

    return new NextResponse(JSON.stringify(newCar), { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create car' }), { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    // Verify the token and get the userId
    // console.log(req.headers.get('Authorization'));
    const token = req.headers.get('Authorization')?.split(' ')[1]; // "Bearer token"
    // console.log(token);
    const decoded = verifyToken(req);
    const { userId } = decoded;

    // Fetch the user's cars
    const cars = await Car.find({ userId });

    return new NextResponse(JSON.stringify(cars), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch cars' }), { status: 500 });
  }
}

// You can similarly add PUT, DELETE methods to update or delete the car
