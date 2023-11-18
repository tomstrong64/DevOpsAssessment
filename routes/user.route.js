import { Router } from 'express';
import { noAuth, stdAuth, adminAuth } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', noAuth, UserController.login);
router.post('/register', noAuth, UserController.create);

router.get('/logout', stdAuth, UserController.logout);
router.put('/updateUser', stdAuth, UserController.updateUser);
router.get('/profile', stdAuth, UserController.profile);
router.get('/getUser', stdAuth, UserController.getUserById);

router.delete('/deleteUser/:id', adminAuth, UserController.deleteUser);
router.put('/updateUser/:id', adminAuth, UserController.updateUserStatus);
router.get('/list', adminAuth, UserController.getAllUsers);

export default router;
