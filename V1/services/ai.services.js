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
      return item.name || item.nombre || item.ingredient || item.step || item.descripcion || item.description || JSON.stringify(item);
    }

    return String(item);
  });
};

// Detecta si un texto está en inglés usando palabras frecuentes
const detectarIngles = (texto) => {
  const palabrasIngles = [
    "the", "and", "with", "add", "heat", "cup", "tablespoon", "teaspoon",
    "mix", "cook", "stir", "oven", "bake", "dice", "chop", "slice",
    "pour", "place", "remove", "combine", "until", "over", "medium",
    "skillet", "bowl", "pan", "minutes", "season", "pepper", "salt"
  ];
  const textoLower = texto.toLowerCase();
  const coincidencias = palabrasIngles.filter((p) => textoLower.includes(p));
  return coincidencias.length >= 3;
};

// Traduce al español si Gemini respondió en inglés
const traducirAlEspanol = async (recetaIA) => {
  const textoARevisar = `${recetaIA.titulo} ${recetaIA.descripcion}`;
  if (!detectarIngles(textoARevisar)) return recetaIA;

  const prompt = `
    Translate the following recipe JSON to Spanish.
    Keep the exact same JSON structure and keys.
    Only translate the text values, do not translate the JSON keys.
    Respond ONLY with valid JSON, no explanations.

    ${JSON.stringify(recetaIA)}

    {
      "titulo": "",
      "descripcion": "",
      "ingredientes": [],
      "pasos": []
    }
  `;

  try {
    const response = await axios.post(
      ENDPOINT,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers }
    );

    const texto = response.data.candidates[0].content.parts[0].text;
    const match = texto.match(/\{[\s\S]*\}/);
    if (!match) return recetaIA;

    return JSON.parse(match[0]);
  } catch {
    // Si falla la traducción, devuelve el original sin romper el flujo
    return recetaIA;
  }
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

  if(usuario.plan!=="premium"){

    const cantidad= await Receta.countDocuments({ autor });
    if(cantidad>=4){
      const error = new Error("Límite de recetas alcanzado para el plan plus");
      error.status = 400;
      throw error;
    }

  }

  const prompt = `
    Generá una receta de cocina usando estos ingredientes: ${ingredientes.join(", ")}.
    Dificultad: ${dificultad}.

    IMPORTANTE: Respondé SOLO en formato JSON válido y en ESPAÑOL.

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

  recetaIA = await traducirAlEspanol(recetaIA);

  const ingredientesNormalizados = normalizarArrayDeStrings(recetaIA.ingredientes);
  const pasosNormalizados = normalizarArrayDeStrings(recetaIA.pasos);

  const nuevaReceta = new Receta({
    titulo: recetaIA.titulo,
    descripcion: recetaIA.descripcion,
    ingredientes: ingredientesNormalizados,
    pasos: pasosNormalizados,
    autor,
    autorNombre: usuario.nombre,
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
  const usuarioAdaptar = await Usuario.findOne({ correo: autor });
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

  if(usuarioAdaptar.plan=="plus"){

    const cantidad= await Receta.countDocuments({ autor });
    if(cantidad>=4){
      const error = new Error("Límite de recetas alcanzado para el plan plus");
      error.status = 400;
      throw error;
    }

  }

  const prompt = `
    Convertí esta receta a una versión ${tipo}.

    IMPORTANTE:
    - Respondé SOLO con JSON válido
    - Sin explicaciones
    - En ESPAÑOL

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

  recetaIA = await traducirAlEspanol(recetaIA);

  const ingredientesNormalizados = normalizarArrayDeStrings(recetaIA.ingredientes);
  const pasosNormalizados = normalizarArrayDeStrings(recetaIA.pasos);

  const nuevaReceta = new Receta({
    titulo: recetaIA.titulo + ` (${tipo})`,
    descripcion: recetaIA.descripcion,
    ingredientes: ingredientesNormalizados,
    pasos: pasosNormalizados,
    autor,
    autorNombre: usuarioAdaptar?.nombre,
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