/**
 * @swagger
 * tags:
 *   - name: "Auth"
 *     description: "Authentication related routes"
 * 
 * /api/login:
 *   post:
 *     tags:
 *       - "Auth"
 *     summary: "User login"
 *     description: "Login with email and password"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: "Login successful"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "JWT token"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: "Bad Request, missing fields"
 *       401:
 *         description: "Invalid credentials"
 *       500:
 *         description: "Internal Server Error"
 */

import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';  // Import bcryptjs for password comparison
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  console.log("database connected in login")
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password); // bcrypt compares the plain password with the hashed password
    if (!isMatch) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401 }
      );
    }

    // Create a JWT token if the password is correct
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console.log("returning token in login", token);
    // Send the token in the response
    return new NextResponse(
      JSON.stringify({ token }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Login failed' }),
      { status: 500 }
    );
  }
}
