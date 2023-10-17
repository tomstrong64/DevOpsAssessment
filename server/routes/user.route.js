
import { Router } from 'express';
import { authMiddleware } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.get('/login', UserController.login);
router.post('/register', UserController.create);
router.get('/logout', authMiddleware, UserController.logout);

  

export default router;