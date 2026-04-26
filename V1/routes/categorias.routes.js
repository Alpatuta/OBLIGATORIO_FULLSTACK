import express from "express";

import { crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria } from "../controllers/categorias.controller.js";

const router = express.Router({mergeParams: true});

router.post("/", crearCategoria);
router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.patch("/:id", actualizarCategoria);
router.delete("/:id", eliminarCategoria);

export default router;

