import express from "express";
import {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    eliminarReceta,
    obtenerRecetasCombinadas
} from "../controllers/recetas.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/",validateBodyMiddleware(recetaSchema), crearReceta);
router.get("/", obtenerRecetas);
router.get("/combinadas", obtenerRecetasCombinadas);
router.get("/:id", obtenerRecetaPorId);
router.patch("/:id", actualizarReceta);
router.delete("/:id", eliminarReceta);

export default router;
