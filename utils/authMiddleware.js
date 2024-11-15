import jwt from 'jsonwebtoken';

export const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Authorization header: "Bearer <token>"

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT verification
    return decoded; // return the decoded token data
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
