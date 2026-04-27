import joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/; 

export const generarYGuardarRecetaIASchema = joi.object({
    ingredientes: joi.array().items(joi.string()).min(1).required(),
    dificultad: joi.string().valid("Fácil", "Media", "Difícil").required(),
    categoria: joi.string().pattern(objectIdRegex).required()
});


export const adaptarRecetaSchema = joi.object({
    tipo: joi.string()
        .valid("vegan", "vegetarian", "gluten-free", "keto", "low-carb", "paleo", "dairy-free", "nut-free", "low-fat", "high-protein", "low-sodium", "sugar-free", "whole30", "mediterranean", "raw", "low-calorie", "high-fiber", "diabetic-friendly", "kid-friendly", "quick-and-easy", "comfort-food", "gourmet", "fusion", "seasonal", "holiday", "budget-friendly", "slow-cooker", "one-pot", "grilling", "air-fryer", "instant-pot", "sheet-pan", "stir-fry", "soup-and-stew")
        .required()
        .messages({
            "string.base": "El tipo debe ser un texto",
            "any.only": "El tipo debe ser uno de los siguientes: vegan, vegetarian, gluten-free, keto, low-carb, paleo, dairy-free, nut-free, low-fat, high-protein, low-sodium, sugar-free, whole30, mediterranean, raw, low-calorie, high-fiber, diabetic-friendly, kid-friendly, quick-and-easy, comfort-food, gourmet, fusion, seasonal, holiday, budget-friendly, slow-cooker, one-pot, grilling, air-fryer, instant-pot, sheet-pan o stir-fry",
            "any.required": "El tipo es obligatorio"
        })
});


