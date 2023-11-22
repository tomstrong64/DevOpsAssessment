import { Router } from 'express';
import * as PoiController from '../controllers/poi.controller.js';
import { stdAuth, noAuth, adminAuth } from '../middlewares/user.middleware.js';

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
 *     summary: Get a list of Points of Interest
 *     description: Get a list of Points of Interest. Requires standard authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Points of Interest
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal Server Error

 */
router.get('/list', stdAuth, PoiController.getPois);

/**
 * @openapi
 * /pois/{id}:
 *   get:
 *     summary: Get a Point of Interest by ID
 *     description: Get a Point of Interest by ID. Requires standard authentication.
 *     security:
 *       - BearerAuth: []
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
router.get('/:id', stdAuth, PoiController.getPoiById);

/**
 * @openapi
 * /pois/addPoi:
 *   post:
 *     summary: Add a new Point of Interest
 *     description: Add a new Point of Interest. Requires standard authentication.
 *     security:
 *       - BearerAuth: []
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
router.post('/addPoi', stdAuth, PoiController.addPoi);

/**
 * @openapi
 * /pois/deletePoi/{id}:
 *   delete:
 *     summary: Delete a Point of Interest by ID
 *     description: Delete a Point of Interest by ID. Requires standard authentication.
 *     security:
 *       - BearerAuth: []
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
router.delete('/deletePoi/:id', stdAuth, PoiController.deletePoi);

/**
 * @openapi
 * /pois/updatePoi/{id}:
 *   put:
 *     summary: Update a Point of Interest by ID
 *     description: Update a Point of Interest by ID. Requires standard authentication.
 *     security:
 *       - BearerAuth: []
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
router.put('/updatePoi/:id', stdAuth, PoiController.updatePoi);

export default router;
