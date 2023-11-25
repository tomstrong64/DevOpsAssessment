/*
 * Copyright [2023] [Coordinated Chaos]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
