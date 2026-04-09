import express from "express";

import { loginUsuario,registerUsuario } from "../controllers/auth.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { registerSchema } from "../validators/auth.validators.js";

const router = express.Router({ mergeParams: true });

router.post("/login",loginUsuario);

router.post("/register", validateBodyMiddleware (registerSchema), registerUsuario); //

export default router;