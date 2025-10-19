import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      user_id?: number;
      sub?: string;
    }
  }
}

export interface UserRequest extends Request {
  user_id: number;
  user?: any;
  sub?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // Skip authentication for public routes
    if (req.originalUrl === '/users/login' || req.originalUrl === '/users' && req.method === 'POST') {
      return next();
    }

    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = process.env.JWT_SECRET || 'change_this_secret_in_production';
      const payload = jwt.verify(token, secret) as any;
      
      req.user = { email: payload.email };
      req.user_id = payload.sub; // The user ID from JWT payload
      req.sub = payload.sub;

      next();
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid token');
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      const rawToken = authHeader.split(' ').slice(1).join(' ');
      return rawToken
        .replace(/\s+/g, '') // Remove all whitespace
        .replace(/["']/g, '') // Remove any quotes
        .trim();
    }
    return null;
  }
}
