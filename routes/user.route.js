import { Router } from 'express';
import { noAuth, stdAuth } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', noAuth, UserController.login);
router.post('/register', noAuth, UserController.create);
router.get('/logout', stdAuth, UserController.logout);

export default router;
