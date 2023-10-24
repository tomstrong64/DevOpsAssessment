import { Router } from 'express';
import * as PoiController from '../controllers/poi.controller.js';

const router = Router();

router.get('/allPois', PoiController.getPois);
router.get('/searchPoi/:region', PoiController.getPoiByRegion);
router.post('/addPoi', PoiController.addPoi);
router.delete('/deletePoi/:id', PoiController.deletePoi);
router.put('/updatePoi/:id', PoiController.updatePoi);

export default router;
