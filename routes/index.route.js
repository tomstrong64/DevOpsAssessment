import { Router } from 'express';
import * as IndexController from '../controllers/index.controller.js';
import { noAuth, stdAuth, adminAuth } from '../middlewares/user.middleware.js';

const router = Router();

// GET request for the index page
router.get('/', stdAuth, IndexController.home);
router.get('/addpoi', stdAuth, IndexController.addpoi);
router.get('/allpois', stdAuth, IndexController.allpois);
router.get('/allusers', adminAuth, IndexController.allusers);
router.get('/updatepoi', stdAuth, IndexController.updatepoi);
router.get('/updateuser', stdAuth, IndexController.updateuser);
router.get('/register', noAuth, IndexController.register);
router.get('/login', noAuth, IndexController.login);
router.get('/privacypolicy', IndexController.privacypolicy);
export default router;
