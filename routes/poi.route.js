import { Router } from 'express';
import * as PoiController from '../controllers/poi.controller.js';
import { stdAuth } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/list', stdAuth, PoiController.getPois);
router.get('/:id', stdAuth, PoiController.getPoiById);
router.post('/addPoi', stdAuth, PoiController.addPoi);
router.delete('/deletePoi/:id', stdAuth, PoiController.deletePoi);
router.put('/updatePoi/:id', stdAuth, PoiController.updatePoi);

export default router;
