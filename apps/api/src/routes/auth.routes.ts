import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

router.get('/stats', (req, res, next) => controller.getStats(req, res, next));
router.get('/events', (req, res, next) => controller.getEvents(req, res, next));

export default router;
