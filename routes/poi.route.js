import { Router } from 'express';
import * as PoiController from '../controllers/poi.controller.js';
import { stdAuth, noAuth, adminAuth } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/list', stdAuth, PoiController.getPois);
router.get('/:id', stdAuth, PoiController.getPoiById);
router.post('/addPoi', stdAuth, PoiController.addPoi);

router.delete('/deletePoi/:id', adminAuth, PoiController.deletePoi);
router.put('/updatePoi/:id', adminAuth, PoiController.updatePoi);

export default router;
