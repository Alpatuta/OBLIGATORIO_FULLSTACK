import express from "express";
import { agregarIngrediente } from "../controllers/ingrediente.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", agregarIngrediente);

export default router;