import { Router } from 'express';
import { ServicesController } from '../controllers/services.controller';

const router = Router();
const controller = new ServicesController();

router.get('/', (req, res, next) => controller.findAll(req, res, next));
router.get('/:slug/stats', (req, res, next) => controller.getStats(req, res, next));

export default router;
