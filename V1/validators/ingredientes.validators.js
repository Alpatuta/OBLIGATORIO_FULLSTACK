import joi from "joi";

export const ingredienteSchema = joi.object({
    nombre: joi.string().min(3).required().messages({
        "string.base": "El nombre debe ser una cadena de texto",
        "string.empty": "El nombre no puede estar vacío",
        "string.min": "El nombre debe tener al menos 3 caracteres",
        "any.required": "El nombre es requerido"
    }),
    cantidad: joi.number().positive().required().messages({
        "number.base": "La cantidad debe ser un número",
        "number.positive": "La cantidad debe ser un número positivo",
        "any.required": "La cantidad es requerida"
    }),
    unidad: joi.string().min(1).required().messages({
        "string.base": "La unidad debe ser una cadena de texto",
        "string.empty": "La unidad no puede estar vacía",
        "string.min": "La unidad debe tener al menos 1 carácter",
        "any.required": "La unidad es requerida"
    })
}); 

export const actualizarIngredienteSchema = joi.object({
    nombre: joi.string().min(3).messages({
        "string.base": "El nombre debe ser una cadena de texto",
        "string.empty": "El nombre no puede estar vacío",
        "string.min": "El nombre debe tener al menos 3 caracteres"
    }),
    cantidad: joi.number().positive().messages({
        "number.base": "La cantidad debe ser un número",
        "number.positive": "La cantidad debe ser un número positivo"
    }),
    unidad: joi.string().min(1).messages({
        "string.base": "La unidad debe ser una cadena de texto",
        "string.empty": "La unidad no puede estar vacía",
        "string.min": "La unidad debe tener al menos 1 carácter"
    })
});

