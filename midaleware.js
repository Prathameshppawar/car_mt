import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  console.log(`Request to: ${pathname}`);

  // Skip the middleware for public pages like login or signup
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    console.log("Skipping middleware for public page");
    return NextResponse.next();
  }

  // Extract the token from the Authorization header
  const token = req.headers.get('Authorization')?.split(' ')[1];
  // console.log(req);

  // If no token is provided, redirect to login
  if (!token) {
    console.log("No token found, redirecting to login from middleware");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the JWT token with the secret
    jwt.verify(token, process.env.JWT_SECRET);

    // If verification succeeds, allow the request to proceed
    console.log("Token is valid");
    return NextResponse.next();
  } catch (err) {
    // Log the error for invalid or expired token
    console.error("Invalid or expired token:", err.message);

    // Redirect the user to login page
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Define the pages that need authentication protection
export const config = {
  matcher: ['/dashboard', '/create', '/create-car', '/cars'], // Only these routes need authentication
};
