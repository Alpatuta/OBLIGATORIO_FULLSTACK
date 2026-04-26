import joi from "joi";

export const categoriaSchema = joi.object({
    nombre: joi.string().min(3).required().messages({
        "string.base": "El nombre debe ser una cadena de texto",
        "string.empty": "El nombre no puede estar vacío"
    }),
    descripcion: joi.string().min(5).required().messages({
        "string.base": "La descripción debe ser una cadena de texto",
        "string.empty": "La descripción no puede estar vacía"
    })
});