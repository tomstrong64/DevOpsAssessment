import { Router } from 'express';

import * as HealthController from '../controllers/health.controller.js';

const router = Router();

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     tags: [Health]
 *     summary: Check the health of the API
 *     description: Check the health of the API
 *     responses:
 *       200:
 *         description: The API is healthy
 *       500:
 *         description: The API is not healthy
 */
router.get('/', HealthController.check);

export default router;
