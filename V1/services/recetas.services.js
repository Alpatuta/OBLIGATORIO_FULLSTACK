import Receta from "../models/receta.model.js";
import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";
import {generarYGuardarRecetaIAService,adaptarRecetaIAService} from "./ai.services.js"
import { isValidObjectId } from "mongoose";
import axios from "axios";

const MEALDB_API_URL = "https://www.themealdb.com/api/json/v1/1";

// PARA CREAR RECETA
export const crearRecetaService = async (recetaData, autor) => {
  const usuario = await Usuario.findOne({ correo: autor });
  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  if (usuario.plan === "plus") {
    const cantidad = await Receta.countDocuments({ autor });
    if (cantidad >= 4) {
      const error = new Error("Límite de recetas alcanzado para el plan plus");
      error.status = 400;
      throw error;
    }
  }

  const recetaExistente = await Receta.findOne({ titulo: recetaData.titulo });
  if (recetaExistente) {
    const error = new Error("Ya existe una receta con ese título");
    error.status = 400;
    throw error;
  }

  const nuevaReceta = new Receta({ ...recetaData, autor });
  await nuevaReceta.save();

  await Categoria.findByIdAndUpdate(
    recetaData.categoria,

    { $addToSet: { recetas: nuevaReceta._id } },
  );

  return nuevaReceta;
};

//CONSULTAS + PAGINACION + FILTROS

export const obtenerRecetasService = async (query) => {
  const { page = 1, limit = 10, autor, dificultad } = query;
  const filtro = {};
  if (autor) {
    filtro.autor = autor;
  }
  if (dificultad) {
    filtro.dificultad = dificultad;
  }
  const recetas = await Receta.find(filtro).populate("categoria", "nombre")
    .skip((page - 1) * limit) // Calcula el número de documentos a omitir porque sino
    // siempre va a mostrar las primeras recetas
    .limit(limit); // Limita la cantidad de recetas que se muestran por página ya que sino muestra todas las recetas
  return recetas;
};

export const obtenerRecetaPorIdService = async (id) => {
  //Para validar que el ID que me pasan es un ID de MongoDB válido uso el isValidObjectId.
  if (!isValidObjectId(id)) {
    const error = new Error("ID no válido");
    error.status = 400;
    throw error;
  }

  const receta = await Receta.findById(id);

  if (!receta) {
    const error = new Error("Receta no encontrada");
    error.status = 404;
    throw error;
  }
  return receta;
};

export const actualizarRecetaService = async (id, recetaData, autor) => {
  if (!isValidObjectId(id)) {
    const error = new Error("ID no válido");
    error.status = 400;
    throw error;
  }

  const recetaExistente = await Receta.findOne({
    titulo: recetaData.titulo,
    _id: { $ne: id },
  });

  if (recetaExistente) {
    const error = new Error("Ya existe una receta con ese título");
    error.status = 400;
    throw error;
  }

  const receta = await Receta.findById(id);
  if (!receta) {
    const error = new Error("Receta no encontrada");
    error.status = 404;
    throw error;
  }

  if (receta.autor !== autor) {
    const error = new Error(
      "No tienes permiso para actualizar esta receta. Solo el autor puede actualizarla.",
    );
    error.status = 403;
    throw error;
  }

  if (receta.categoria.toString() !== recetaData.categoria) {

    // sacar receta de la anterior categoria

    await Categoria.findByIdAndUpdate(
      receta.categoria,

      { $pull: { recetas: id } },
    );

    // agregar a la nueva

    await Categoria.findByIdAndUpdate(
      recetaData.categoria,

      { $addToSet: { recetas: id } },
    );
  }
  const recetaActualizada = await Receta.findByIdAndUpdate(id, recetaData, {
    new: true,
  });

  return recetaActualizada;
};

export const eliminarRecetaService = async (recetaId) => {
  if (!isValidObjectId(recetaId)) {
    const error = new Error("ID no válido");
    error.status = 400;
    throw error;
  }
  const receta = await Receta.findByIdAndDelete(recetaId);
  if (!receta) {
    const error = new Error("Receta no encontrada");
    error.status = 404;
    throw error;
  }

  if (!receta) {

    const error = new Error("Receta no encontrada");

    error.status = 404;

    throw error;

}

await Categoria.findByIdAndUpdate(

    receta.categoria,

    { $pull: { recetas: recetaId } }

);
  return receta;
};

export const obtenerRecetasCombinadasService = async (query) => {
  const { ing1, ing2, ing3 } = query;

  const ingredientes = [ing1, ing2, ing3].filter(Boolean);

  if (ingredientes.length === 0) {
    const error = new Error("Debe enviar al menos un ingrediente");
    error.status = 400;
    throw error;
  }

  let mapa = {};

  //EXTERNAS
  for (let ing of ingredientes) {
    let response;

    //Hago try por las dudas de que la API externa falle o tenga algún error, para no romper toda la consulta de recetas combinadas
    try {
      response = await axios.get(`${MEALDB_API_URL}/filter.php?i=${ing}`);
    } catch (e) {
      const error = new Error("Error al consumir API externa");
      error.status = 500;
      throw error;
    }

    const lista = response.data.meals || [];

    lista.forEach((receta) => {
      if (!mapa[receta.idMeal]) {
        mapa[receta.idMeal] = {
          id: receta.idMeal,
          titulo: receta.strMeal,
          imagen: receta.strMealThumb,
          origen: "externa",
          ingredientesMatch: 0,
        };
      }
      mapa[receta.idMeal].ingredientesMatch++;
    });
  }

  //INTERNAS
  const recetasInternas = await Receta.find();

  recetasInternas.forEach((receta) => {
    let match = 0;

    ingredientes.forEach((ing) => {
      if (
        receta.ingredientes.some((i) =>
          i.toLowerCase().includes(ing.toLowerCase()),
        )
      ) {
        match++;
      }
    });

    if (match > 0) {
      mapa[receta._id] = {
        id: receta._id,
        titulo: receta.titulo,
        descripcion: receta.descripcion,
        origen: "interna",
        ingredientesMatch: match,
      };
    }
  });

  const recetas = Object.values(mapa);

  if (recetas.length === 0) {
    const error = new Error("No se encontraron recetas");
    error.status = 404;
    throw error;
  }

  //FILTRO
  const completas = recetas.filter(
    (r) => r.ingredientesMatch === ingredientes.length,
  );

  if (completas.length > 0) {
    return completas.sort((a, b) => b.ingredientesMatch - a.ingredientesMatch);
  }

  return recetas.sort((a, b) => b.ingredientesMatch - a.ingredientesMatch);
};

export const generarRecetaIAService = async (ingredientes, dificultad, categoria, autor) => {
  const recetaIA = await generarYGuardarRecetaIAService(ingredientes, dificultad, categoria, autor);

  return recetaIA;
}

export const adaptarRecetaIAService = async (id, tipo, autor) => {
  const recetaAdaptada = await adaptarRecetaIAService(id, tipo, autor);

  return recetaAdaptada;
}