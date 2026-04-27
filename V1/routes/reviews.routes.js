import express from "express";
import {
    crearReview,
    actualizarReview,
    obtenerReviewsPorReceta,
    eliminarReview,
    obtenerReviewPorId,
    obtenerReviewsPorUsuario
} from "../controllers/reviews.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { crearReviewSchema, actualizarReviewSchema } from "../validators/reviews.validators.js";


const router = express.Router({ mergeParams: true });

router.post("/", validateBodyMiddleware(crearReviewSchema), crearReview);
router.patch("/:id", validateBodyMiddleware(actualizarReviewSchema), actualizarReview);
router.get("/receta/:recetaId", obtenerReviewsPorReceta);
router.delete("/:id", eliminarReview);
router.get("/:id", obtenerReviewPorId);
router.get("/usuario/me", obtenerReviewsPorUsuario);

export default router;