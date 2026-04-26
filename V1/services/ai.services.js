import axios from "axios";
import Receta from "../models/receta.model.js";
import Usuario from "../models/usuario.model.js";

const API_KEY = process.env.GEMINI_25_API_KEY;
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY
};

export const generarYGuardarRecetaIAService = async (ingredientes, dificultad, autor, categoria) => {

    if (!ingredientes || ingredientes.length === 0) {
        const error = new Error("Debe enviar al menos un ingrediente");
        error.status = 400;
        throw error;
    }

    const usuario = await Usuario.findOne({ correo: autor });
    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    }


    const prompt = `
    Generate a cooking recipe using these ingredients: ${ingredientes.join(", ")}.
    Difficulty: ${dificultad}.

    IMPORTANT: Respond ONLY in valid JSON format and in ENGLISH.

    {
      "titulo": "",
      "descripcion": "",
      "ingredientes": [],
      "pasos": []
    }
    `;

    let response;

    try {
        response = await axios.post(ENDPOINT, {
            contents: [{ parts: [{ text: prompt }] }]
        }, { headers });

    } catch (e) {
        const error = new Error("Error al consumir IA");
        error.status = 500;
        throw error;
    }

    if (!response.data.candidates || response.data.candidates.length === 0) {
        const error = new Error("IA no devolvió resultados");
        error.status = 500;
        throw error;
    }

    const texto = response.data.candidates[0].content.parts[0].text;

    let recetaIA;

    try {
        recetaIA = JSON.parse(texto);
    } catch {
        const error = new Error("Respuesta inválida de la IA");
        error.status = 500;
        throw error;
    }

    if (!recetaIA.titulo || !recetaIA.descripcion) {
        const error = new Error("Datos incompletos generados por IA");
        error.status = 500;
        throw error;
    }

    // GUARDADO EN DB
    const nuevaReceta = new Receta({
        titulo: recetaIA.titulo,
        descripcion: recetaIA.descripcion,
        ingredientes: recetaIA.ingredientes,
        pasos: recetaIA.pasos,
        autor,
        dificultad,
        categoria
    });

    await nuevaReceta.save();

    return nuevaReceta;
};