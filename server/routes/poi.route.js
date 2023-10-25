import { Router } from 'express';
import * as PoiController from '../controllers/poi.controller.js';

const router = Router();

router.get('/list', PoiController.getPois);
router.post('/addPoi', PoiController.addPoi);
router.delete('/deletePoi/:id', PoiController.deletePoi);
router.put('/updatePoi', PoiController.updatePoi);

export default router;
