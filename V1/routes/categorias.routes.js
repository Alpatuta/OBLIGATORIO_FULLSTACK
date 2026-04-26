import express from "express";

import { crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria } from "../controllers/categorias.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { categoriaSchema } from "../validators/categorias.validators.js";

const router = express.Router({mergeParams: true});

router.post("/",validateBodyMiddleware(categoriaSchema), crearCategoria); //esto 
router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.patch("/:id", actualizarCategoria);
router.delete("/:id", eliminarCategoria);

export default router;

