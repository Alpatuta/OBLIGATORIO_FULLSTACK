import express from "express";

import { crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria } from "../controllers/categorias.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { categoriaSchema,actualizarCategoriaSchema } from "../validators/categorias.validators.js";


const router = express.Router({mergeParams: true});

router.post("/",validateBodyMiddleware(categoriaSchema), crearCategoria); //esto 
router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.patch("/:id",validateBodyMiddleware(actualizarCategoriaSchema), actualizarCategoria);
router.delete("/:id" ,eliminarCategoria);

export default router;

