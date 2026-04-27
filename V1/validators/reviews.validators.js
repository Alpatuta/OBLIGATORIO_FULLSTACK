import joi from 'joi';

const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;

export const crearReviewSchema = joi.object({
    comentario: joi.string().trim().min(5).max(1000).required().messages({
        "string.base": "El comentario debe ser una cadena de texto",
        "string.min": "El comentario debe tener al menos 5 caracteres",
        "string.max": "El comentario no debe exceder los 1000 caracteres",
        "any.required": "El comentario es obligatorio"
    }),
    calificacion: joi.number().min(1).max(5).required().messages({
        "number.min": "La calificación debe ser un número entre 1 y 5",
        "number.max": "La calificación debe ser un número entre 1 y 5",
        "any.required": "La calificación es obligatoria"
    }),
    receta: joi.string().pattern(ObjectIdRegex).length(24).required().messages({
        "string.pattern.base": "El ID de la receta debe ser un ObjectId válido",
        "string.length": "El ID de la receta debe tener 24 caracteres",
        "any.required": "La receta es obligatoria"
    })
});

export const actualizarReviewSchema = joi.object({
    comentario: joi.string().trim().min(5).max(1000).messages({
        "string.base": "El comentario debe ser una cadena de texto",
        "string.min": "El comentario debe tener al menos 5 caracteres",
        "string.max": "El comentario no debe exceder los 1000 caracteres",
    }),
    calificacion: joi.number().min(1).max(5).messages({
        "number.min": "La calificación debe ser un número entre 1 y 5",
        "number.max": "La calificación debe ser un número entre 1 y 5",
    }),
    // No permitimos actualizar la receta a la que pertenece la review
}).options({ allowUnknown: false });