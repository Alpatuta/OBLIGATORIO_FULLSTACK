import express from "express";

import {useGemini25Flash,getModels} from '../controllers/ai.controller.js';

const router = express.Router({ mergeParams: true });  

router.get ( "/",getModels);

router.post ( "/",useGemini25Flash);

export default router;