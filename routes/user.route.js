import { Router } from 'express';
import { authMiddleware } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.get('/list', UserController.getUser);
router.get('/login', UserController.login);
router.get('/logout', authMiddleware, UserController.logout);
router.post('/register', UserController.create);
router.put('/updateUser', UserController.updateUser);
router.get('/profile', UserController.profile);


export default router;
