import express from "express";
import { cambiarPlanUsuario } from "../controllers/usuarios.controller.js";
import { accessMiddleware } from "../middlewares/access.middleware.js";

const router = express.Router({ mergeParams: true });

router.patch("/cambiar-plan", accessMiddleware(["admin"]), cambiarPlanUsuario);

export default router;