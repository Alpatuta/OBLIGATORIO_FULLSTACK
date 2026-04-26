import joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/; 

export const generarYGuardarRecetaIASchema = joi.object({
    ingredientes: joi.array().items(joi.string()).min(1).required(),
    dificultad: joi.string().valid("Fácil", "Media", "Difícil").required(),
    categoria: joi.string().pattern(objectIdRegex).required()
});