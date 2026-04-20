import express from "express";
import { subirImagen } from "../controllers/uploads.controller";

const router = express.Router({mergeParams: true});

router.post("/", subirImagen);

export default router;