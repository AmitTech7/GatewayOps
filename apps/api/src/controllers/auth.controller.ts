import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { from, to } = req.query as { from?: string; to?: string };
      const stats = await authService.getStats(from, to);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10' } = req.query as { page?: string; limit?: string };
      const result = await authService.getEvents(parseInt(page, 10), parseInt(limit, 10));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
