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
    // 1) Allow CORS preflight
    if (req.method === 'OPTIONS') return next();

    // 2) Normalize path (strip querystring)
    const path = (req.originalUrl || req.url || '').split('?')[0];

    // 3) Public endpoints (exact path matches)
    const isPublic =
      (path === '/' && req.method === 'GET') ||
      (path === '/users' && req.method === 'POST') ||
      (path === '/users/login' && req.method === 'POST') ||
      (path === '/users/signup-seed' && req.method === 'POST');

    if (isPublic) return next();

    // 4) Extract Bearer token
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // 5) Verify JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException(
        'Server misconfigured: JWT_SECRET not set',
      );
    }

    try {
      const payload = jwt.verify(token, secret) as any;

      // Shape: { sub: userId, email: string, ... }
      const userIdNum =
        typeof payload.sub === 'number'
          ? payload.sub
          : Number.parseInt(String(payload.sub), 10);

      if (!Number.isFinite(userIdNum)) {
        throw new UnauthorizedException('Invalid token payload (sub)');
      }

      // Attach to request for downstream use
      req.user = { email: payload.email };
      req.user_id = userIdNum;
      req.sub = String(payload.sub);

      return next();
    } catch (err: any) {
      throw new UnauthorizedException(err?.message || 'Invalid token');
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    // Accept formats like: "Bearer token"  (ignore extra whitespace/quotes)
    const [scheme, ...rest] = authHeader.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer') return null;

    const raw = rest.join(' ');
    const cleaned = raw.replace(/\s+/g, '').replace(/["']/g, '').trim();
    return cleaned || null;
  }
}
