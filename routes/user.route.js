import { Router } from 'express';
import { authMiddleware } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();


router.post('/login', UserController.login);
router.post('/register', UserController.create);

router.put('/updateUser', authMiddleware, UserController.updateUser);
router.get('/profile', authMiddleware, UserController.profile);
router.get('/list', authMiddleware, UserController.getUser);
router.get('/logout', authMiddleware, UserController.logout);
export default router;
