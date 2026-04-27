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
    return nuevaReview;
}