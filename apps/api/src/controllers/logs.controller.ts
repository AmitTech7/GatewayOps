import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { LogsService } from '../services/logs.service';

const logsService = new LogsService();

export class LogsController {
  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        page = '1',
        limit = '10',
        service,
        statusCode,
        from,
        to,
        search,
      } = req.query as {
        page?: string;
        limit?: string;
        service?: string;
        statusCode?: string;
        from?: string;
        to?: string;
        search?: string;
      };

      const result = await logsService.getLogs({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        service,
        statusCode: statusCode ? parseInt(statusCode, 10) : undefined,
        from,
        to,
        search,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const log = await logsService.getLogById(id);
      res.json({ data: log });
    } catch (error) {
      next(error);
    }
  }
}
