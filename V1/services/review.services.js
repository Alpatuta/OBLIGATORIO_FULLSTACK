import Usuario from "../models/usuario.model.js";
import Receta from "../models/receta.model.js";
import Review from "../models/review.model.js";
import { isValidObjectId } from "mongoose";

//Crear review
export const crearReviewService = async (reviewData, autor) => {
    const usuario = await Usuario.findOne({ correo: autor });
    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    }

    if (!isValidObjectId(reviewData.receta)) {
        const error = new Error("ID de receta no válido");
        error.status = 400;
        throw error;
    }

    const receta = await Receta.findById(reviewData.receta);
    if (!receta) {
        const error = new Error("Receta no encontrada");
        error.status = 404;
        throw error;
    }

    const nuevaReview = new Review({
        usuario: usuario._id,
        receta: reviewData.receta,
        comentario: reviewData.comentario,
        calificacion: reviewData.calificacion
    });

    await nuevaReview.save();

    //Me guardo la review en el array de recetas
    await Receta.findByIdAndUpdate(reviewData.receta, { $addToSet: { reviews: nuevaReview._id } });

    return nuevaReview;
}

//Actualizar review
export const actualizarReviewService = async (reviewId, reviewData, autor) => {
    if (!isValidObjectId(reviewId)) {
        const error = new Error("ID de review no válido");
        error.status = 400;
        throw error;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        const error = new Error("Review no encontrada");
        error.status = 404;
        throw error;
    }

    const usuario = await Usuario.findOne({ correo: autor });
    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    }

    if (review.usuario.toString() !== usuario._id.toString()) {
        const error = new Error("No tienes permiso para actualizar esta review");
        error.status = 403;
        throw error;
    }

    // Actualizar la review
    review.comentario = reviewData.comentario;
    review.calificacion = reviewData.calificacion;

    await review.save();
    return review;
}