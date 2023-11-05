import { Router } from 'express';
import * as PoiController from '../controllers/poi.controller.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { authMiddleware } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/list', PoiController.getPois);
router.post('/addPoi', PoiController.addPoi);
router.delete('/deletePoi/:id', PoiController.deletePoi);
router.put('/updatePoi', PoiController.updatePoi);

export default router;
