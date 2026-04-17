import {
    crearRecetaService,
    obtenerRecetasService,
    obtenerRecetaPorIdService,
    actualizarRecetaService,
    eliminarRecetaService
} from "../services/recetas.services.js";

//ALTA

export const crearReceta = async (req, res) => {
    try {
        const receta = await crearRecetaService(req.body, req.user.correo);
        res.status(201).json({ message: "Receta creada exitosamente", receta });
    } catch (error) {
        if (error.message === "Usuario no encontrado") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "Límite de recetas alcanzado para el plan plus") {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al crear la receta", error: error.message });
    }
};

//CONSULTA GENERAL DE RECETAS

export const obtenerRecetas = async (req, res) => {
    try {
        const recetas = await obtenerRecetasService(req.query);
        res.status(200).json({ message: "Recetas obtenidas exitosamente", recetas });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las recetas", error: error.message });
    }
};

//CONSULTA POR ID DE RECETAS

export const obtenerRecetaPorId = async (req, res) => {
    try {
        const receta = await obtenerRecetaPorIdService(req.params.id);
        if (!receta) {
            return res.status(404).json({ message: "Receta no encontrada" });
        }
        res.status(200).json({ message: "Receta obtenida exitosamente", receta });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la receta", error: error.message });
    }
};

//ACTUALIZAR RECETA

export const actualizarReceta = async (req, res) => {
    try {
        const recetaActualizada = await actualizarRecetaService(req.params.id, req.body, req.user.correo);
        if (!recetaActualizada) {
            return res.status(404).json({ message: "Receta no encontrada" });
        }
        res.status(200).json({ message: "Receta actualizada exitosamente", receta: recetaActualizada });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la receta", error: error.message });
    };
};

//ELIMINAR RECETA

export const eliminarReceta = async (req, res) => {
    try {
        const recetaEliminada = await eliminarRecetaService(req.params.id, req.user.correo);
        if (!recetaEliminada) {
            return res.status(404).json({ message: "Receta no encontrada" });
        }
        res.status(200).json({ message: "Receta eliminada exitosamente", receta: recetaEliminada });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la receta", error: error.message });
    }
};   