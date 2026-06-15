import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { RateLimitsService } from '../services/rateLimits.service';

const rateLimitsService = new RateLimitsService();

export class RateLimitsController {
  async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { from, to } = req.query as { from?: string; to?: string };
      const summary = await rateLimitsService.getSummary(from, to);
      res.json({ data: summary });
    } catch (error) {
      next(error);
    }
  }

  async getViolations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { from, to } = req.query as { from?: string; to?: string };
      const violations = await rateLimitsService.getViolations(from, to);
      res.json({ data: violations });
    } catch (error) {
      next(error);
    }
  }

  async getTopOffenders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const offenders = await rateLimitsService.getTopOffenders();
      res.json({ data: offenders });
    } catch (error) {
      next(error);
    }
  }
}
