/*
 * Copyright [2023] [Coordinated Chaos]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Router } from 'express';
import * as IndexController from '../controllers/index.controller.js';
import {
    noAuthPage,
    stdAuthPage,
    adminAuthPage,
} from '../middlewares/user.middleware.js';

const router = Router();

// GET request for the index page
router.get('/', stdAuthPage, IndexController.home);
router.get('/addpoi', stdAuthPage, IndexController.addpoi);
router.get('/allpois', stdAuthPage, IndexController.allpois);
router.get('/allusers', adminAuthPage, IndexController.allusers);
router.get('/updatepoi', stdAuthPage, IndexController.updatepoi);
router.get('/updateuser', stdAuthPage, IndexController.updateuser);
router.get('/register', noAuthPage, IndexController.register);
router.get('/login', noAuthPage, IndexController.login);
router.get('/privacypolicy', IndexController.privacypolicy);
router.get('/user-docs', IndexController.userdocs);
export default router;
