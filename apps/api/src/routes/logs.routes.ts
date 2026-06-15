import { Router } from 'express';
import { LogsController } from '../controllers/logs.controller';

const router = Router();
const controller = new LogsController();

router.get('/', (req, res, next) => controller.findAll(req, res, next));
router.get('/:id', (req, res, next) => controller.findOne(req, res, next));

export default router;
