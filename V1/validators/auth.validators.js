import joi from 'joi';

export const registerSchema = joi.object({
    nombre: joi.string().min(3).max(100).required().messages({
        'string.base': 'El nombre debe ser una cadena de texto',
        'string.empty': 'El nombre no puede estar vacío',
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede tener más de 100 caracteres',
        'any.required': 'El nombre es obligatorio',
    }),
    contrasenia: joi.string().min(6).max(100).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
        'string.base': 'La contraseña debe ser una cadena de texto',
        'string.empty': 'La contraseña no puede estar vacía',
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
        'string.max': 'La contraseña no puede tener más de 100 caracteres',
        'any.required': 'La contraseña es obligatoria',
    }),
    plan: joi.string().valid('plus', 'premium').default('plus').messages({
        'string.empty': 'El plan no puede estar vacío',
        'any.only': 'El plan debe ser "plus" o "premium"',
        'any.default': 'El plan por defecto es "plus"',
    }),
    confirmarContrasenia: joi.string().valid(joi.ref('contrasenia')).required().messages({
        'any.only': 'Las contraseñas deben coincidir',
        'any.required': 'La confirmación de contraseña es obligatoria',
    })
});