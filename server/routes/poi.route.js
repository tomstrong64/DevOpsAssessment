import {Router} from 'express'
import * as PoiController from '../controllers/poi.controller.js'

const router = Router();

router.get('/allPois', PoiController.getPois);
router.get('/addPoi', PoiController.addPoi);
router.get('/deletePoi', PoiController.deletePoi);
router.get('/updatePoi', PoiController.updatePoi);