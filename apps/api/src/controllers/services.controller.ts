import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ServicesService } from '../services/services.service';

const servicesService = new ServicesService();

export class ServicesController {
  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const services = await servicesService.getServices();
      res.json({ data: services });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const stats = await servicesService.getServiceStats(slug);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
}
