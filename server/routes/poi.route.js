import { Router } from 'express';
import * as PoiController from '../controllers/poi.controller.js';

const router = Router();

router.get('/allPois', PoiController.getPois);
router.post('/addPoi', PoiController.addPoi);
router.delete('/deletePoi', PoiController.deletePoi);
router.put('/updatePoi', PoiController.updatePoi);

export default router;
