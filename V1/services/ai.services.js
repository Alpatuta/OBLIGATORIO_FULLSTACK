import axios from "axios";
import Receta from "../models/receta.model.js";
import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";

const API_KEY = process.env.GEMINI_25_API_KEY;
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const headers = {
  "Content-Type": "application/json",
  "x-goog-api-key": API_KEY,
};

const normalizarArrayDeStrings = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if (typeof item === "string") return item;

    if (typeof item === "object" && item !== null) {
      return item.name || item.nombre || item.ingredient || item.step || JSON.stringify(item);
    }

    return String(item);
  });
};

// METODO PARA GENERAR Y GUARDAR RECETA CON IA
export const generarYGuardarRecetaIAService = async (
  ingredientes,
  dificultad,
  autor,
  categoria,
) => {
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
    response = await axios.post(
      ENDPOINT,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers },
    );
  } catch (e) {
    console.error("Gemini error status:", e.response?.status);
    console.error("Gemini error data:", e.response?.data || e.message);

    const error = new Error(
      e.response?.data?.error?.message || "Error al consumir IA"
    );
    error.status = e.response?.status || 500;
    throw error;
  }

  if (!response.data.candidates || response.data.candidates.length === 0) {
    const error = new Error("IA no devolvió resultados");
    error.status = 500;
    throw error;
  }

  const texto = response.data.candidates[0].content.parts[0].text;

  const match = texto.match(/\{[\s\S]*\}/);

  if (!match) {
    const error = new Error("No se pudo extraer JSON de la respuesta de la IA");
    error.status = 500;
    throw error;
  }

  let recetaIA;

  try {
    recetaIA = JSON.parse(match[0]);
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

  const ingredientesNormalizados = normalizarArrayDeStrings(recetaIA.ingredientes);
  const pasosNormalizados = normalizarArrayDeStrings(recetaIA.pasos);

  const nuevaReceta = new Receta({
    titulo: recetaIA.titulo,
    descripcion: recetaIA.descripcion,
    ingredientes: ingredientesNormalizados,
    pasos: pasosNormalizados,
    autor,
    dificultad,
    categoria,
  });

  await nuevaReceta.save();

  await Categoria.findByIdAndUpdate(
    categoria,
    { $addToSet: { recetas: nuevaReceta._id } },
  );

  return nuevaReceta;
};

//METODO PARA MEJORAR RECETA EXISTENTE CON IA

export const adaptarRecetaIAService = async (id, tipo, autor) => {
  const receta = await Receta.findById(id);

  if (!receta) {
    const error = new Error("Receta no encontrada");
    error.status = 404;
    throw error;
  }

  if (!tipo) {
    const error = new Error("Debe indicar el tipo de adaptación");
    error.status = 400;
    throw error;
  }

  const prompt = `
    Convert this recipe into a ${tipo} version.

    IMPORTANT:
    - Respond ONLY with valid JSON
    - No explanations
    - In ENGLISH

    ${JSON.stringify(receta)}

    {
      "titulo": "",
      "descripcion": "",
      "ingredientes": [],
      "pasos": []
    }
    `;

  let response;

  try {
    response = await axios.post(
      ENDPOINT,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers },
    );
  } catch (e) {
    console.error("Gemini error status:", e.response?.status);
    console.error("Gemini error data:", e.response?.data || e.message);

    const error = new Error(
      e.response?.data?.error?.message || "Error al consumir IA"
    );
    error.status = e.response?.status || 500;
    throw error;
  }

  const texto = response.data.candidates[0].content.parts[0].text;

  const match = texto.match(/\{[\s\S]*\}/);

  if (!match) {
    const error = new Error("No se pudo extraer JSON");
    error.status = 500;
    throw error;
  }

  let recetaIA;

  try {
    recetaIA = JSON.parse(match[0]);
  } catch {
    const error = new Error("Respuesta inválida de la IA");
    error.status = 500;
    throw error;
  }

  const ingredientesNormalizados = normalizarArrayDeStrings(recetaIA.ingredientes);
  const pasosNormalizados = normalizarArrayDeStrings(recetaIA.pasos);

  const nuevaReceta = new Receta({
    titulo: recetaIA.titulo + ` (${tipo})`,
    descripcion: recetaIA.descripcion,
    ingredientes: ingredientesNormalizados,
    pasos: pasosNormalizados,
    autor,
    dificultad: receta.dificultad,
    categoria: receta.categoria,
  });

  await nuevaReceta.save();

  await Categoria.findByIdAndUpdate(
    receta.categoria,
    { $addToSet: { recetas: nuevaReceta._id } },
  );

  return nuevaReceta;
};