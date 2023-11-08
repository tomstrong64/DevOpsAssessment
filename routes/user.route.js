import { Router } from 'express';
import { noAuth, stdAuth, adminAuth } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', noAuth, UserController.login);
router.post('/register', noAuth, UserController.create);
router.get('/logout', stdAuth, UserController.logout);
router.post('/registerAdmin', adminAuth, UserController.createAdmin);


router.put('/updateUser', stdAuth, UserController.updateUser);
router.get('/profile', stdAuth, UserController.profile);
router.get('/getUser', stdAuth, UserController.getUserById);
router.get('/list', stdAuth, UserController.getAllUsers);



export default router;
