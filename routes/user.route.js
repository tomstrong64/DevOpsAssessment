import { Router } from 'express';
import { noAuth, stdAuth, adminAuth } from '../middlewares/user.middleware.js';
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
 */

/**
 * @openapi
 * /user/login:
 *  tags: [User]
 *   post:
 *     summary: User login
 *     description: Authenticate a user and generate an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
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
router.post('/login', noAuth, UserController.login);

/**
 * @openapi
 * /user/register:
 *  tags: [User]
 *   post:
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
router.post('/register', noAuth, UserController.create);

/**
 * @openapi
 * /user/logout:
 * tags: [User]
 *   get:
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
router.get('/logout', stdAuth, UserController.logout);

/**
 * @openapi
 * /user/updateUser:
 * tags: [User]
 *   put:
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
router.put('/updateUser', stdAuth, UserController.updateUser);

/**
 * @openapi
 * /user/getUser:
 * tags: [User]
 *   get:
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
router.get('/getUser', stdAuth, UserController.getUserById);

/**
 * @openapi
 * /user/deleteUser/{id}:
 * tags: [User]
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete user by ID. Requires admin authentication.
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
 *       204:
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have admin privileges.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/deleteUser/:id', adminAuth, UserController.deleteUser);

/**
 * @openapi
 * /user/updateUser/{id}:
 * tags: [User]
 *   put:
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
router.put('/updateUser/:id', adminAuth, UserController.updateUserStatus);

/**
 * @openapi
 * /user/list:
 * tags: [User]
 *   get:
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
router.get('/list', adminAuth, UserController.getAllUsers);

export default router;
