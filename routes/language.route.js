import { Router } from 'express';
import * as languageController from '../controllers/language.controller.js';

const router = Router();

router.get('/en', languageController.en);
router.get('/pt', languageController.pt);
router.get('/es', languageController.es);
router.get('/fr', languageController.fr);
router.get('/tr', languageController.tr);

export default router;
