import { Router } from 'express';
import * as IndexController from '../controllers/index.controller.js';

const router = Router();

// GET request for the index page
router.get('/', IndexController.home);
router.get('/addpoi', IndexController.addpoi);
router.get('/allpois', IndexController.allpois);
router.get('/allusers', IndexController.allusers);
router.get('/updatepoi', IndexController.updatepoi);
export default router;
