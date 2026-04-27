import {
    crearReviewService,
    actualizarReviewService,
    obtenerReviewsPorRecetaService,
    eliminarReviewService,
    obtenerReviewPorIdService,
    obtenerReviewsPorUsuarioService
} from "../services/review.services.js";

//Crear review
export const crearReview = async (req, res) => {
    const review = await crearReviewService(req.body, req.user.correo);
    res.status(201).json({ message: "Review creada exitosamente", review });
}

//Actualizar review
export const actualizarReview = async (req, res) => {
    const reviewActualizada = await actualizarReviewService(req.params.id, req.body, req.user.correo);
    res.status(200).json({ message: "Review actualizada exitosamente", review: reviewActualizada });
}

//Obtener reviews por receta
export const obtenerReviewsPorReceta = async (req, res) => {
    const reviews = await obtenerReviewsPorRecetaService(req.params.recetaId);
    res.status(200).json({ message: "Reviews obtenidas exitosamente", reviews });
}

//Eliminar review
export const eliminarReview = async (req, res) => {
    const reviewEliminada = await eliminarReviewService(req.params.id, req.user.correo);
    res.status(200).json({ message: "Review eliminada exitosamente", review: reviewEliminada });
}

//Obtener review por ID
export const obtenerReviewPorId = async (req, res) => {
    const review = await obtenerReviewPorIdService(req.params.id);
    res.status(200).json({ message: "Review obtenida exitosamente", review });
}

//Obtener reviews por usuario
export const obtenerReviewsPorUsuario = async (req, res) => {
    const reviews = await obtenerReviewsPorUsuarioService(req.user.correo);
    res.status(200).json({ message: "Reviews obtenidas exitosamente", reviews });
}
