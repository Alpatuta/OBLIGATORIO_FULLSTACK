import Receta from "../models/receta.model.js";
import Usuario from "../models/usuario.model.js";

// PARA CREAR RECETA
export const crearRecetaService = async (recetaData, autor) => {
    const usuario = await Usuario.findOne({ correo: autor });
    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    if (usuario.plan === "plus") {
        const cantidad = await Receta.countDocuments({ autor });
        if (cantidad >= 4) {
            throw new Error("Límite de recetas alcanzado para el plan plus");
        }
    }
    const nuevaReceta = new Receta({ ...recetaData, autor });
    await nuevaReceta.save();
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
    const recetas = await Receta.find(filtro)
        .skip((page - 1) * limit) // Calcula el número de documentos a omitir porque sino 
        // siempre va a mostrar las primeras recetas
        .limit(limit); // Limita la cantidad de recetas que se muestran por página ya que sino muestra todas las recetas
    return recetas;
}

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
    const receta = await Receta.findByIdAndUpdate(id, recetaData, { new: true });
    return receta;
};

export const eliminarRecetaService = async (recetaId) => {
    const receta = await Receta.findByIdAndDelete(recetaId);
    return receta;
};