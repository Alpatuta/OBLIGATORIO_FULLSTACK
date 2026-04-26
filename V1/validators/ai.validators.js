import joi from "joi";

export const generarRecetaIASchema = joi.object({
    ingredientes: joi.array().items(joi.string()).min(1).required(),
    dificultad: joi.string().valid("Fácil", "Media", "Difícil").required()
});