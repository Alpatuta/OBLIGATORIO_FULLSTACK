import axios from "axios";

const API_KEY = process.env.GEMINI_25_API_KEY;
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY
};

export const generarRecetaIAService = async (ingredientes, dificultad) => {

    if (!ingredientes || ingredientes.length === 0) {
        const error = new Error("Debe enviar al menos un ingrediente");
        error.status = 400;
        throw error;
    }

    const prompt = `
    Genera una receta con estos ingredientes: ${ingredientes.join(", ")}.
    Dificultad: ${dificultad}.

    RESPONDE SOLO JSON:
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

    try {
        return JSON.parse(texto);
    } catch {
        const error = new Error("Respuesta inválida de la IA");
        error.status = 500;
        throw error;
    }
};