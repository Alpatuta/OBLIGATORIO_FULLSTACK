import express from "express";
import { agregarIngrediente, obtenerIngredientes, obtenerIngredientePorId, actualizarIngrediente, eliminarIngrediente } from "../controllers/ingrediente.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", agregarIngrediente);
router.get("/", obtenerIngredientes);
router.get("/:id", obtenerIngredientePorId);
router.patch("/:id", actualizarIngrediente);
router.delete("/:id", eliminarIngrediente);

export default router;