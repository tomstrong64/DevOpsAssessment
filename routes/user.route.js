import { Router } from 'express';
import { authMiddleware } from '../middlewares/user.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', UserController.login);
router.post('/register', UserController.create);
router.post('/registerAdmin', UserController.createAdmin);


router.put('/updateUser', authMiddleware, UserController.updateUser);
router.get('/profile', authMiddleware, UserController.profile);
router.get('/getUser', authMiddleware, UserController.getUserById);
router.get('/logout', authMiddleware, UserController.logout);
router.get('/list', adminMiddleware, UserController.getAllUsers);



export default router;
