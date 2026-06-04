import express from "express";
import { cambiarPlanUsuario, cambiarPlanUsuarioAdmin, obtenerUsuarios } from "../controllers/usuarios.controller.js";
import { accessMiddleware } from "../middlewares/access.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", accessMiddleware(["admin"]), obtenerUsuarios);
router.patch("/cambiar-plan", accessMiddleware(["admin"]), cambiarPlanUsuario);
router.patch("/cambiar-plan-admin", accessMiddleware(["admin"]), cambiarPlanUsuarioAdmin);

export default router;