import express from "express";
import {
    crearReceta,
    obtenerRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    eliminarReceta,
    obtenerRecetasCombinadas
} from "../controllers/recetas.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", crearReceta);
router.get("/", obtenerRecetas);
router.get("/:id", obtenerRecetaPorId);
router.patch("/:id", actualizarReceta);
router.delete("/:id", eliminarReceta);
router.get("/combinadas", obtenerRecetasCombinadas);

export default router;
