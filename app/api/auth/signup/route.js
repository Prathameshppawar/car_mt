import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';  // Import bcryptjs
import jwt from 'jsonwebtoken';  // Import JWT for token generation
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();
    console.log(email, password);
    
    // Check if email and password are provided
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: 'Email already exists' }),
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds

    // Create a new user with the hashed password
    const newUser = new User({ email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();
    console.log('User saved', newUser);

    // Create a JWT token after user is created
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the success message and JWT token
    return new NextResponse(
      JSON.stringify({ message: 'User created successfully', token }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create user' }),
      { status: 500 }
    );
  }
}
