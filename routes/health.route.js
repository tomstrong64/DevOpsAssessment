import { Router } from 'express';

import * as HealthController from '../controllers/health.controller.js';

const router = Router();

router.get('/', HealthController.check);

export default router;
