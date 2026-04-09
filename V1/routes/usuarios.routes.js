import express from "express";
import { cambiarPlanUsuario } from "../controllers/usuarios.controller.js";

const router = express.Router({mergeParams: true});

router.patch("/cambiar-plan", cambiarPlanUsuario);

export default router;