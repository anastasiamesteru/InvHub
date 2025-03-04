import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header not provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decodedToken; 
    next();
  });
};
