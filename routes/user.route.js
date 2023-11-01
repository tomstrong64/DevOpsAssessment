import { Router } from 'express';
import { authMiddleware } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();


router.post('/login', UserController.login);
router.post('/register', UserController.create);

router.put('/updateUser', UserController.updateUser);
router.get('/profile', UserController.profile);
router.get('/list', UserController.getUser);
router.get('/logout', authMiddleware, UserController.logout);
export default router;
