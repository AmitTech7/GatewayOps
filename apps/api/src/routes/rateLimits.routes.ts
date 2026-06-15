import { Router } from 'express';
import { RateLimitsController } from '../controllers/rateLimits.controller';

const router = Router();
const controller = new RateLimitsController();

router.get('/summary', (req, res, next) => controller.getSummary(req, res, next));
router.get('/violations', (req, res, next) => controller.getViolations(req, res, next));
router.get('/top-offenders', (req, res, next) => controller.getTopOffenders(req, res, next));

export default router;
