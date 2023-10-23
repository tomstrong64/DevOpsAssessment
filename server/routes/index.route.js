import { Router } from 'express';
import * as IndexController from '../controllers/index.controller.js';

const router = Router();

router.get('/home', IndexController.home);
router.get('/addPoi', IndexController.addPoi);
router.get('/login', IndexController.login);
router.get('/register', IndexController.register);

export default router;
