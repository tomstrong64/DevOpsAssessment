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
import * as PoiController from '../controllers/poi.controller.js';
import { stdAuthAPI } from '../middlewares/user.middleware.js';
import { upload } from '../middlewares/file.middleware.js';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Poi:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         country:
 *           type: string
 *         region:
 *           type: string
 *         lat:
 *           type: number
 *         lon:
 *           type: number
 *         description:
 *           type: string
 *         user:
 *           type: string
 *           format: uuid
 *       required:
 *         - name
 *         - lat
 *         - lon
 */

/**
 * @openapi
 * /pois/list:
 *   get:
 *     tags: [POI]
 *     summary: Get a list of Points of Interest
 *     description: Get a list of Points of Interest. Requires standard authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Points of Interest
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal Server Error

 */
router.get('/list', stdAuthAPI, PoiController.getPois);

/**
 * @openapi
 * /pois/{id}:
 *   get:
 *     tags: [POI]
 *     summary: Get a Point of Interest by ID
 *     description: Get a Point of Interest by ID. Requires standard authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Point of Interest
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A Point of Interest
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: Point of Interest not found
 *       500:
 *         description: Internal Server Error

 */
router.get('/:id', stdAuthAPI, PoiController.getPoiById);

/**
 * @openapi
 * /pois/addPoi:
 *   post:
 *     tags: [POI]
 *     summary: Add a new Point of Interest
 *     description: Add a new Point of Interest. Requires standard authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Poi'
 *     responses:
 *       201:
 *         description: Point of Interest added successfully
 *       400:
 *         description: Bad request. Check request payload.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal Server Error

 */
router.post(
    '/addPoi',
    stdAuthAPI,
    upload.single('image'),
    PoiController.addPoi
);

/**
 * @openapi
 * /pois/deletePoi/{id}:
 *   delete:
 *     tags: [POI]
 *     summary: Delete a Point of Interest by ID
 *     description: Delete a Point of Interest by ID. Requires standard authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Point of Interest
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Point of Interest deleted successfully
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Point of Interest not found
 *       500:
 *         description: Internal Server Error

 */
router.delete('/deletePoi/:id', stdAuthAPI, PoiController.deletePoi);

/**
 * @openapi
 * /pois/updatePoi/{id}:
 *   put:
 *     tags: [POI]
 *     summary: Update a Point of Interest by ID
 *     description: Update a Point of Interest by ID. Requires standard authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Point of Interest
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Poi'
 *     responses:
 *       200:
 *         description: Point of Interest updated successfully
 *       400:
 *         description: Bad request. Check request payload.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: Point of Interest not found
 *       500:
 *         description: Internal Server Error

 */
router.put(
    '/updatePoi/:id',
    upload.single('image'),
    stdAuthAPI,
    PoiController.updatePoi
);

/**
 * @openapi
 * /pois/image/{id}:
 *   get:
 *     tags: [POI]
 *     summary: Get a Point of Interest image by POI ID
 *     description: Get a Point of Interest image by POI ID. Requires standard authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Point of Interest
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Point of Interest image
 *       400:
 *         description: Bad request. Invalid ID.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: Point of Interest or image not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/image/:id', stdAuthAPI, PoiController.getImage);

export default router;
