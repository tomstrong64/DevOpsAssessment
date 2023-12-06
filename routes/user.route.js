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
import {
    noAuthAPI,
    stdAuthAPI,
    adminAuthAPI,
} from '../middlewares/user.middleware.js';
import * as UserController from '../controllers/user.controller.js';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 */

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags: [User]
 *     summary: User login
 *     description: Authenticate a user and generate an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful, returns an access token.
 *       400:
 *         description: Bad request. Check request payload.
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal Server Error.

 */
router.post('/login', noAuthAPI, UserController.login);

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags: [User]
 *     summary: User registration
 *     description: Register a new user and generate an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request. Check request payload.
 *       401:
 *         description: Unauthorized. User with the provided email already exists.
 *       500:
 *         description: Internal Server Error.

 */
router.post('/register', noAuthAPI, UserController.create);

/**
 * @openapi
 * /user/logout:
 *   get:
 *     tags: [User]
 *     summary: User logout
 *     description: Invalidate the user's access token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/logout', stdAuthAPI, UserController.logout);

/**
 * @openapi
 * /user/updateUser:
 *   put:
 *     tags: [User]
 *     summary: Update user details
 *     description: Update the details of the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *       400:
 *         description: Bad request. Check request payload.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */
router.put('/updateUser', stdAuthAPI, UserController.updateUser);

/**
 * @openapi
 * /user/getUser:
 *   get:
 *     tags: [User]
 *     summary: Get user by ID
 *     description: Get user details by ID. Requires standard authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/getUser', stdAuthAPI, UserController.getUserById);

/**
 * @openapi
 * /user/deleteUser:
 *   delete:
 *     tags: [User]
 *     summary: Delete the authenticated user (admin or standard user)
 *     description: >
 *       Delete the user account. Requires standard authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have sufficient privileges.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/deleteUser', stdAuthAPI, UserController.deleteUser);

/**
 * @openapi
 * /user/updateUser/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update user status by ID
 *     description: Update user status by ID. Requires admin authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have admin privileges.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.put('/updateUser/:id', adminAuthAPI, UserController.updateUserStatus);

/**
 * @openapi
 * /user/list:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     description: Get a list of all users. Requires admin authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have admin privileges.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/list', adminAuthAPI, UserController.getAllUsers);

export default router;
