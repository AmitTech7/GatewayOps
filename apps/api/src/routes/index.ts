import { Router } from 'express';
import metricsRoutes from './metrics.routes';
import logsRoutes from './logs.routes';
import servicesRoutes from './services.routes';
import rateLimitsRoutes from './rateLimits.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/metrics', metricsRoutes);
router.use('/logs', logsRoutes);
router.use('/services', servicesRoutes);
router.use('/rate-limits', rateLimitsRoutes);
router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: 'connected',
    redis: 'connected',
  });
});

export default router;
