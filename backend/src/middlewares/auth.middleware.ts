import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.status(401).json({ code: 401, message: 'No token provided', data: {} });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ code: 401, message: 'Invalid token format', data: {} });
    return;
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).json({ code: 401, message: 'Unauthorized', data: {} });
      return;
    }
    (req as any).user = decoded;
    next();
  });
}
