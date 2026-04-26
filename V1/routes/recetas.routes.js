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
import { crearRecetaSchema } from "../validators/recetas.validators.js";
import { generarRecetaIASchema } from "../validators/ai.validators.js";

const router = express.Router({ mergeParams: true });

router.post("/",validateBodyMiddleware(crearRecetaSchema), crearReceta);
router.post("/ia", validateBodyMiddleware(generarRecetaIASchema), generarRecetaIA);
router.get("/", obtenerRecetas);
router.get("/combinadas", obtenerRecetasCombinadas);
router.get("/:id", obtenerRecetaPorId);
router.patch("/:id", actualizarReceta);
router.delete("/:id", eliminarReceta);

export default router;
