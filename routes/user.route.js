import { Router } from 'express';
<<<<<<< HEAD
import { authMiddleware } from '../middlewares/user.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
=======
import { noAuth, stdAuth } from '../middlewares/user.middleware.js';
>>>>>>> 67-auth-uses-cookies-instead-of-tokens-which-is-not-ideal-for-api-use

import * as UserController from '../controllers/user.controller.js';

const router = Router();

<<<<<<< HEAD
router.post('/login', UserController.login);
router.post('/register', UserController.create);
router.post('/registerAdmin', UserController.createAdmin);


router.put('/updateUser', authMiddleware, UserController.updateUser);
router.get('/profile', authMiddleware, UserController.profile);
router.get('/getUser', authMiddleware, UserController.getUserById);
router.get('/logout', authMiddleware, UserController.logout);
router.get('/list', adminMiddleware, UserController.getAllUsers);


=======
router.post('/login', noAuth, UserController.login);
router.post('/register', noAuth, UserController.create);
router.get('/logout', stdAuth, UserController.logout);
>>>>>>> 67-auth-uses-cookies-instead-of-tokens-which-is-not-ideal-for-api-use

export default router;
