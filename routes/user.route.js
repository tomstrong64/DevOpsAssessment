import { Router } from 'express';
import { noAuth, stdAuth, adminAuth } from '../middlewares/user.middleware.js';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', noAuth, UserController.login);
router.post('/register', noAuth, UserController.create);
router.get('/logout', stdAuth, UserController.logout);
router.post('/registerAdmin',  UserController.createAdmin);


router.put('/updateUser', stdAuth, UserController.updateUser);
router.get('/profile', stdAuth, UserController.profile);
router.get('/getUser', stdAuth, UserController.getUserById);
router.delete('/deleteUser', stdAuth, UserController.deleteUser);
router.get('/list', adminAuth, UserController.getAllUsers);



export default router;
