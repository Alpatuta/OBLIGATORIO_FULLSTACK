import joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const campoTextoArray = joi.array().items(
    joi.string().trim().min(1).required().messages({
        "string.base": "Cada elemento debe ser una cadena de texto",
        "string.empty": "Los elementos no pueden estar vacíos",
        "string.min": "Los elementos deben tener al menos 1 caracter",
        "any.required": "Cada elemento es obligatorio",
    })
).min(1);

export const crearRecetaSchema = joi.object({
    titulo: joi.string().trim().min(3).max(150).required().messages({
        "string.base": "El título debe ser una cadena de texto",
        "string.empty": "El título no puede estar vacío",
        "string.min": "El título debe tener al menos 3 caracteres",
        "string.max": "El título no puede tener más de 150 caracteres",
        "any.required": "El título es obligatorio",
    }),
    descripcion: joi.string().trim().min(10).max(2000).required().messages({
        "string.base": "La descripción debe ser una cadena de texto",
        "string.empty": "La descripción no puede estar vacía",
        "string.min": "La descripción debe tener al menos 10 caracteres",
        "string.max": "La descripción no puede tener más de 2000 caracteres",
        "any.required": "La descripción es obligatoria",
    }),
    ingredientes: campoTextoArray.required().messages({
        "array.base": "Los ingredientes deben ser un arreglo",
        "array.min": "Debe incluir al menos 1 ingrediente",
        "any.required": "Los ingredientes son obligatorios",
    }),
    pasos: campoTextoArray.required().messages({
        "array.base": "Los pasos deben ser un arreglo",
        "array.min": "Debe incluir al menos 1 paso",
        "any.required": "Los pasos son obligatorios",
    }),
    dificultad: joi.string().valid("Fácil", "Media", "Difícil").required().messages({
        "string.base": "La dificultad debe ser una cadena de texto",
        "any.only": "La dificultad debe ser Fácil, Media o Difícil",
        "any.required": "La dificultad es obligatoria",
    }),
    categoria: joi.string().pattern(objectIdRegex).required().messages({
        "string.base": "La categoría debe ser una cadena de texto",
        "string.pattern.base": "La categoría debe ser un ObjectId válido",
        "any.required": "La categoría es obligatoria",
    }),
}).options({ allowUnknown: false });

export const actualizarRecetaSchema = joi.object({
    titulo: joi.string().trim().min(3).max(150).messages({
        "string.base": "El título debe ser una cadena de texto",
        "string.empty": "El título no puede estar vacío",
        "string.min": "El título debe tener al menos 3 caracteres",
        "string.max": "El título no puede tener más de 150 caracteres",
    }),
    descripcion: joi.string().trim().min(10).max(2000).messages({
        "string.base": "La descripción debe ser una cadena de texto",
        "string.empty": "La descripción no puede estar vacía",
        "string.min": "La descripción debe tener al menos 10 caracteres",
        "string.max": "La descripción no puede tener más de 2000 caracteres",
    }),
    ingredientes: campoTextoArray.messages({
        "array.base": "Los ingredientes deben ser un arreglo",
        "array.min": "Debe incluir al menos 1 ingrediente",
    }),
    pasos: campoTextoArray.messages({
        "array.base": "Los pasos deben ser un arreglo",
        "array.min": "Debe incluir al menos 1 paso",
    }),
    dificultad: joi.string().valid("Fácil", "Media", "Difícil").messages({
        "string.base": "La dificultad debe ser una cadena de texto",
        "any.only": "La dificultad debe ser Fácil, Media o Difícil",
    }),
    categoria: joi.string().pattern(objectIdRegex).messages({
        "string.base": "La categoría debe ser una cadena de texto",
        "string.pattern.base": "La categoría debe ser un ObjectId válido",
    }),
}).min(1).options({ allowUnknown: false });

